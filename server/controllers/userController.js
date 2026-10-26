const User = require('../models/User');

// Search users by skill
exports.searchUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.query;
    if (!skill) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      'skillsOffered.skillName': { $regex: skill, $options: 'i' },
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Smart matching logic
exports.getSwapMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    const offeredSkillNames = currentUser.skillsOffered.map((s) => s.skillName);
    const wantedSkills = currentUser.skillsWanted;

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      'skillsOffered.skillName': {
        $in: wantedSkills.map((s) => new RegExp(s, 'i')),
      },
      skillsWanted: {
        $in: offeredSkillNames.map((s) => new RegExp(s, 'i')),
      },
    }).select('-password');

    res.status(200).json({ count: matches.length, matches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};