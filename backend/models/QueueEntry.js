const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  question: String,
  joinedAt: { type: Date, default: Date.now },
  priority: { type: Number, required: true }
});

module.exports = mongoose.model('QueueEntry', queueEntrySchema);
