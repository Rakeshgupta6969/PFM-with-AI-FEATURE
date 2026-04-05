import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  limit: {
    type: Number,
    required: true,
    default: 1500.0,
  }
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
