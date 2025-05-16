import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Seed an initial admin or create new users
// @access  Public (use once or secure later)
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', logout);

export default router;
