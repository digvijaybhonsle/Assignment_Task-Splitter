import { parseAndValidate } from '../utils/parseCsv.js';
import Agent from '../models/Agent.js';
import ListItem from '../models/ListItem.js';

// @desc    Upload CSV, parse & distribute items among 5 agents
// @route   POST /api/lists/upload
// @access  Admin

export const uploadAndDistribute = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const records = parseAndValidate(
      req.file.buffer,
      req.file.originalname
    );

    for (const row of records) {
      if (!row.firstName || !/^\+?\d{7,15}$/.test(row.phone)) {
        return res.status(400).json({ message: 'Invalid CSV format' });
      }
    }

    const agents = await Agent.find().limit(5);
    if (agents.length < 5) {
      return res.status(400).json({ message: 'Need at least 5 agents to distribute lists' });
    }

    const total = records.length;
    const base = Math.floor(total / 5);
    const remainder = total % 5;
    let idx = 0;
    const toInsert = [];
    const distribution = [];

    agents.forEach((agent, i) => {
      const count = base + (i < remainder ? 1 : 0);
      const items = records.slice(idx, idx + count).map(row => ({
        agent: agent._id,
        firstName: row.firstName,
        phone: row.phone,
        notes: row.notes || '',
      }));
      idx += count;

      if (items.length > 0) {
        toInsert.push(...items);
        distribution.push({
          agent: {
            id: agent._id,
            name: agent.name,
            email: agent.email,
          },
          count: items.length,
        });
      }
    });

    await ListItem.insertMany(toInsert);

    res.json({
      message: 'Lists distributed',
      distribution,
      items: toInsert,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// @desc    Get lists (all for admin, own for agent)
// @route   GET /api/lists
// @access  Protected
export const getLists = async (req, res) => {
    try {
        let items;
        if (req.user.role === 'admin') {
            items = await ListItem.find().populate('agent', 'name email');
        } else {
            items = await ListItem.find({ agent: req.user._id });
        }
        res.json(items);
    } catch (error) {
        console.error('Get lists error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
