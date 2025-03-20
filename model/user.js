import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedPost' }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
});

const User = mongoose.model('User', UserSchema);

export default User; 