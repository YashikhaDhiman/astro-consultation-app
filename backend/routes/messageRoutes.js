const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// 🔒 POST: Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { recipient, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = new Message({
      sender: req.user._id, // must be set like this
      recipient: req.body.recipient,
      text: req.body.text,
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// 🔒 GET: Messages for the logged-in user
router.get('/mine', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// 🔒 GET: All messages (only astrologer can access)
router.get('/all', protect, async (req, res) => {
  if (req.user.role !== 'astrologer') {
    return res.status(403).json({ message: 'Forbidden: Not an astrologer' });
  }

  try {
    const messages = await Message.find({})
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load all messages' });
  }
});

module.exports = router;
