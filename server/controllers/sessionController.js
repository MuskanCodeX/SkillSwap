const Session = require('../models/Session');

// 1. Send Exchange Request
exports.createSessionRequest = async (req, res) => {
  try {
    const { receiverId, skillRequested, skillOffered, scheduledDate, note } = req.body;
    const requesterId = req.user._id;

    if (requesterId.toString() === receiverId) {
      return res.status(400).json({ message: 'You cannot request an exchange with yourself' });
    }

    const session = new Session({
      requester: requesterId,
      receiver: receiverId,
      skillRequested,
      skillOffered,
      scheduledDate,
      note,
    });

    await session.save();
    res.status(201).json({ message: 'Swap request sent successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get All Sessions for the logged-in user
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ requester: userId }, { receiver: userId }],
    })
      .populate('requester', 'name email skillsOffered')
      .populate('receiver', 'name email skillsOffered')
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Update Session Status (accept/reject/complete)
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const validStatuses = ['accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Sirf session me shamil users hi update kar sakte hain
    const isParticipant =
      session.receiver.toString() === userId.toString() ||
      session.requester.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    session.status = status;
    await session.save();

    res.status(200).json({ message: `Session status updated to ${status}`, session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};