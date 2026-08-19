const express = require('express');
const Task = require('../models/Task');
const Bid = require('../models/Bid');

const router = express.Router();

// 1. POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { posterId, title, description, category, budget, latitude, longitude, addressName, location } = req.body;

    // Resolve coordinates if nested location was sent instead
    const lat = latitude ?? location?.coordinates?.[1] ?? -1.2921;
    const lng = longitude ?? location?.coordinates?.[0] ?? 36.8219;

    if (!posterId || !title || !description || !budget) {
      return res.status(400).json({ error: 'Missing required task fields: posterId, title, description, and budget are required.' });
    }

    const newTask = await Task.create({
      posterId,
      title,
      description,
      category: category || 'Errands',
      budget: Number(budget),
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        addressName: addressName || location?.addressName || 'Specified Location'
      }
    });

    return res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/tasks (Fetch all open tasks)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'OPEN' })
      .sort({ createdAt: -1 })
      .populate('posterId', 'fullName rating');

    return res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Submit a Bid on a Task (Tasker)
router.post('/:taskId/bids', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskerId, amount, note } = req.body;

    if (!taskerId || !amount) {
      return res.status(400).json({ error: 'Tasker ID and bid amount are required' });
    }

    const newBid = await Bid.create({
      taskId,
      taskerId,
      amount,
      note
    });

    return res.status(201).json({ success: true, bid: newBid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;