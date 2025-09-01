import express from 'express';
import { protect, authorize } from '@/middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authorize('admin'), (req, res) => {
  res.json({ message: 'Get all users - Admin only' });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id}` });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', authorize('admin'), (req, res) => {
  res.json({ message: `Delete user ${req.params.id}` });
});

export default router;
