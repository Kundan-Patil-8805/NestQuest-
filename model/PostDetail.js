import mongoose from 'mongoose';

const postDetailSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  utilities: { type: String, default: null },
  pet: { type: String, default: null },
  income: { type: String, default: null },
  size: { type: Number, default: null },
  school: { type: Number, default: null },
  bus: { type: Number, default: null },
  restaurant: { type: Number, default: null },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
});

export default mongoose.model('PostDetail', postDetailSchema);
