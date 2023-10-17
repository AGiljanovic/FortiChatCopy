import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Referencing the User model
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      match: [/^[a-zA-Z0-9 ]+$/, 'First name can only contain letters.'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      match: [/^[a-zA-Z0-9 ]+$/, 'Last name can only contain letters.'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    picturePath: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    userPicturePath: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
