import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  taskTitle: {
    type: String,
    default: 'General Focus'
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 25
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('FocusSession', focusSessionSchema);
