const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    // Skills jo user doosron ko sikha sakta hai
    skillsOffered: [
      {
        skillName: { type: String, required: true },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Beginner',
        },
      },
    ],
    // Skills jo user doosron se seekhna chahta hai
    skillsWanted: [{ type: String }],
    ratingAverage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);