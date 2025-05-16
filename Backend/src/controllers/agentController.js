import Agent from '../models/Agent.js';
// @desc    Create a new agent
// @route   POST /api/agents
// @access  Admin
export const createAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check for duplicate email
    const exists = await Agent.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Agent email already exists' });
    }

    const agent = await Agent.create({ name, email, mobile, password });
    // Exclude password in response
    const { password: _p, ...agentData } = agent.toObject();
    res.status(201).json(agentData);
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Admin
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an agent
// @route   PUT /api/agents/:id
// @access  Admin
export const updateAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    let agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Apply updates
    agent.name = name ?? agent.name;
    agent.email = email ?? agent.email;
    agent.mobile = mobile ?? agent.mobile;
    if (password) agent.password = password;

    await agent.save();
    const { password: _p, ...agentData } = agent.toObject();
    res.json(agentData);
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an agent
// @route   DELETE /api/agents/:id
// @access  Admin
export const deleteAgent = async (req, res) => {
  try {
    // Make sure it's a valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }

    // Look up in the Agent collection
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await agent.deleteOne();

    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single agent by ID
// @route   GET /api/agents/:id
// @access  Admin
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Get agent by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






