const QueueEntry = require('../models/QueueEntry');

// POST /api/queue/join
const joinQueue = async (req, res) => {
  try {
    const { name, email, question } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const currentCount = await QueueEntry.countDocuments();
    const newEntry = new QueueEntry({
      name,
      email,
      question,
      priority: currentCount + 1
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// GET /api/queue
const getQueue = async (req, res) => {
  try {
    const queue = await QueueEntry.find().sort({ joinedAt: 1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /api/queue/:id
const leaveQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await QueueEntry.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({ message: 'User not found in queue' });
    }

    res.json({ message: 'User removed from queue' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  joinQueue,
  getQueue,
  leaveQueue
};
