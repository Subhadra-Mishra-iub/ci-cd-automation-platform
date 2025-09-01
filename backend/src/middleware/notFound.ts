import { Request, Response } from 'express';
import { CustomError } from './errorHandler';

export const notFound = (req: Request, res: Response): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  
  res.status(404).json({
    success: false,
    error: {
      message: error.message,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
