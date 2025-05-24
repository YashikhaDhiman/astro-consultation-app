const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getQueue,
  leaveQueue
} = require('../controllers/queueController');

// Join the queue
router.post('/join', joinQueue);

// Get the current queue
router.get('/', getQueue);

// Leave the queue by ID
router.delete('/:id', leaveQueue);

module.exports = router;
