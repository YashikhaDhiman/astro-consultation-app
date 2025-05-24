const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'QueueEntry', required: true },
  sender: { type: String, enum: ['customer', 'astrologer'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
