const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// 🔒 POST: Send message
router.post('/', protect, async (req, res) => {
  try {
    const message = new Message({
      sender: req.user._id, // Verified from token
      recipient: req.body.recipient, // Optional
      text: req.body.text,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// 🔒 GET: Fetch messages for customer
router.get('/mine', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// 🔒 GET: Fetch all messages (astrologer)
router.get('/all', protect, async (req, res) => {
  if (req.user.role !== 'astrologer') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const messages = await Message.find({})
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load all messages' });
  }
});

module.exports = router;
