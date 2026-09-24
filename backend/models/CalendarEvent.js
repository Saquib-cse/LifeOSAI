import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
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
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String, // HH:MM
    required: true
  },
  endTime: {
    type: String, // HH:MM
    required: true
  },
  category: {
    type: String,
    default: 'General'
  }
}, { timestamps: true });

export default mongoose.model('CalendarEvent', calendarEventSchema);
