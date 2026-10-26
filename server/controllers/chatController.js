const Message = require('../models/Message');

// Get all previous messages for a specific session
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await Message.find({ sessionId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};