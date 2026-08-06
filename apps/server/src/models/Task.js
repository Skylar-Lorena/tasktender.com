const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTaskerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      addressName: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ['OPEN', 'ASSIGNED', 'ESCROW_FUNDED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN'
    }
  },
  { timestamps: true }
);

// Enable 2D sphere index for 2–10km proximity searches
taskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Task', taskSchema);