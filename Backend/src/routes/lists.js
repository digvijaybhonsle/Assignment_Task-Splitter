import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import {
  uploadAndDistribute,
  getLists,
} from '../controllers/listController.js';

const router = express.Router();
const upload = multer(); // in-memory storage

// @route   POST /api/lists/upload
// @desc    Upload CSV, parse & distribute among 5 agents
// @access  Admin
router.post(
  '/upload',
  protect,
  adminOnly,
  upload.single('file'),
  uploadAndDistribute
);

// @route   GET /api/lists
// @desc    Get all lists (admin) or own lists (agent)
// @access  Protected
router.get('/', protect, getLists);

export default router;
