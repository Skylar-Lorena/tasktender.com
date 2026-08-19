const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    nationalId: { type: String },
    isVerified: { type: Boolean, default: false },
    activeRole: { type: String, enum: ['POSTER', 'TASKER'], default: 'POSTER' },
    rating: { type: Number, default: 5.0 },
    completedTasksCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);