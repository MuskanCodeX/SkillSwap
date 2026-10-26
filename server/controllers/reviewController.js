const Review = require('../models/Review');
const User = require('../models/User');
const Session = require('../models/Session');

exports.createReview = async (req, res) => {
  try {
    const { sessionId, reviewedUserId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    // Check karo session valid hai ya nahi
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Ek session ke liye ek hi baar review de sakein
    const existingReview = await Review.findOne({ sessionId, reviewer: reviewerId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    const review = new Review({
      sessionId,
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      rating: Number(rating),
      comment,
    });
    await review.save();

    // User ki nayi average rating calculate karo
    const allReviews = await Review.find({ reviewedUser: reviewedUserId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = (totalRating / allReviews.length).toFixed(1);

    await User.findByIdAndUpdate(reviewedUserId, { ratingAverage: Number(avgRating) });

    res.status(201).json({ message: 'Review submitted successfully', review, averageRating: avgRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};