import express from 'express';
import {
  createAgent,
  getAgents,
  updateAgent,
  deleteAgent,
  getAgentById,
} from '../controllers/agentController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// All routes here require a valid JWT and admin role
router.use(protect, adminOnly);

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Admin
router.post('/', createAgent);

// @route   GET /api/agents
// @desc    Get all agents
// @access  Admin
router.get('/', getAgents);

// @route   PUT /api/agents/:id
// @desc    Update an existing agent
// @access  Admin
router.put('/:id', updateAgent);

// @route   DELETE /api/agents/:id
// @desc    Delete an agent
// @access  Admin
router.delete('/:id', deleteAgent);

// @route   GET /api/agents/:id
// @desc    Get a single agent by ID
// @access  Admin
router.get('/:id', getAgentById);

export default router;
