import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  images: [{ type: String, required: true }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  bedroom: { type: String, required: true },
  bathroom: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  type: { type: String, enum: ['buy', 'rent'], required: true },
  property: { type: String,enum: ['apartment', 'house', 'condo', 'land', 'villa', 'duplex', 'studio', 'penthouse', 'farmhouse'],  required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postDetail: { type: mongoose.Schema.Types.ObjectId, ref: 'PostDetail' },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedPost' }],
});

export default mongoose.model('Post', postSchema);
