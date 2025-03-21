import mongoose from 'mongoose';

const savedPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },
}, { unique: ['user', 'post'] });

export default mongoose.model('SavedPost', savedPostSchema);
