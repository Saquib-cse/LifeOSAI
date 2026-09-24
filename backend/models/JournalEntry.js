import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['Great', 'Good', 'Okay', 'Low'],
    default: 'Good'
  },
  date: {
    type: String, // YYYY-MM-DD
    default: () => new Date().toISOString().split('T')[0]
  }
}, { timestamps: true });

export default mongoose.model('JournalEntry', journalEntrySchema);
