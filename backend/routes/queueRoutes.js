const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getQueue,
  leaveQueue
} = require('../controllers/queueController');
const QueueEntry = require('../models/QueueEntry');

// Join the queue
router.post('/join', joinQueue);

// Get the current queue
router.get('/', getQueue);

// Leave the queue by ID
router.delete('/:id', leaveQueue);

// Get the count of queue entries that have not ended
router.get('/count', async (req, res) => {
  try {
    const count = await QueueEntry.countDocuments({ sessionEnded: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting queue entries' });
  }
});


module.exports = router;
