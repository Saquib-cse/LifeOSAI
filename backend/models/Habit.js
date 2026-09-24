import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'Health'
  },
  streak: {
    type: Number,
    default: 0
  },
  history: [{
    type: String // YYYY-MM-DD dates completed
  }]
}, { timestamps: true });

export default mongoose.model('Habit', habitSchema);
