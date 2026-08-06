const express = require('express');
const Task = require('../models/Task');
const Bid = require('../models/Bid');

const router = express.Router();

// 1. Create a New Task (Task Poster)
router.post('/', async (req, res) => {
  try {
    const { posterId, title, description, category, budget, latitude, longitude, addressName } = req.body;

    if (!posterId || !title || !description || !category || !budget || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required task fields' });
    }

    const newTask = await Task.create({
      posterId,
      title,
      description,
      category,
      budget,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)], // [lng, lat] order required for MongoDB
        addressName: addressName || 'Specified Location'
      }
    });

    return res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. Fetch Nearby Tasks within Radius (Tasker)
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistanceKm = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    // Convert kilometers to meters for MongoDB $near query
    const maxDistanceMeters = parseFloat(maxDistanceKm) * 1000;

    const tasks = await Task.find({
      status: 'OPEN',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    }).populate('posterId', 'fullName rating');

    return res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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