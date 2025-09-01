import express from 'express';
import { protect, authorize } from '@/middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get system metrics
// @route   GET /api/metrics/system
// @access  Private
router.get('/system', (req, res) => {
  res.json({ message: 'Get system metrics' });
});

// @desc    Get pipeline metrics
// @route   GET /api/metrics/pipelines
// @access  Private
router.get('/pipelines', (req, res) => {
  res.json({ message: 'Get pipeline metrics' });
});

// @desc    Get deployment metrics
// @route   GET /api/metrics/deployments
// @access  Private
router.get('/deployments', (req, res) => {
  res.json({ message: 'Get deployment metrics' });
});

// @desc    Get user activity metrics
// @route   GET /api/metrics/users
// @access  Private/Admin
router.get('/users', authorize('admin'), (req, res) => {
  res.json({ message: 'Get user activity metrics' });
});

// @desc    Get performance metrics
// @route   GET /api/metrics/performance
// @access  Private
router.get('/performance', (req, res) => {
  res.json({ message: 'Get performance metrics' });
});

// @desc    Get error metrics
// @route   GET /api/metrics/errors
// @access  Private
router.get('/errors', (req, res) => {
  res.json({ message: 'Get error metrics' });
});

export default router;
