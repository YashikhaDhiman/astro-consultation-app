const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getInbox
} = require('../controllers/messageController');

router.post('/send', sendMessage);
router.get('/:ticketId', getMessages);
router.get('/', getInbox); // Astrologer inbox

module.exports = router;
