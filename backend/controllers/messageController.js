const Message = require('../models/Message');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { ticketId, sender, text } = req.body;
    const message = await Message.create({ ticketId, sender, text });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

// Get all messages for a ticket
exports.getMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const messages = await Message.find({ ticketId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

// Astrologer inbox view (last message per ticket)
exports.getInbox = async (req, res) => {
  try {
    const latestMessages = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$ticketId',
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: {
          newRoot: '$lastMessage'
        }
      },
      {
        $lookup: {
          from: 'queueentries',
          localField: 'ticketId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      }
    ]);
    res.json(latestMessages);
  } catch (error) {
    res.status(500).json({ message: 'Inbox fetch failed', error });
  }
};
