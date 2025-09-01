import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { CustomError } from '@/middleware/errorHandler';
import { redisClient } from '@/config/redis';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Generate JWT Token
const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new CustomError('User already exists', 400));
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'developer',
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    // Store token in Redis for session management
    await redisClient.set(`session:${user._id}`, token, 30 * 24 * 60 * 60); // 30 days

    res.status(201).json({
      success: true,
      data: {
        user: user.fullProfile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      next(new CustomError('Please provide an email and password', 400));
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new CustomError('Invalid credentials', 401));
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      next(new CustomError('Account is deactivated', 401));
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      next(new CustomError('Invalid credentials', 401));
      return;
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    // Store token in Redis
    await redisClient.set(`session:${user._id}`, token, 30 * 24 * 60 * 60);

    res.status(200).json({
      success: true,
      data: {
        user: user.fullProfile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Remove token from Redis
    if (req.user) {
      await redisClient.del(`session:${req.user._id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.fullProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, preferences } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        next(new CustomError('Email already in use', 400));
        return;
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: user.fullProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      next(new CustomError('Please provide current and new password', 400));
      return;
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      next(new CustomError('Current password is incorrect', 400));
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all sessions
    await redisClient.del(`session:${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      next(new CustomError('Token is required', 400));
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JwtPayload;

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      next(new CustomError('User not found or inactive', 401));
      return;
    }

    // Check if token exists in Redis
    const storedToken = await redisClient.get(`session:${user._id}`);
    if (!storedToken || storedToken !== token) {
      next(new CustomError('Invalid or expired token', 401));
      return;
    }

    // Generate new token
    const newToken = generateToken(user._id.toString(), user.email, user.role);

    // Update token in Redis
    await redisClient.set(`session:${user._id}`, newToken, 30 * 24 * 60 * 60);

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    next(new CustomError('Invalid token', 401));
  }
};
