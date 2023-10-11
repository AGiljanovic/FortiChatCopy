import mongoose from "mongoose";

/* 📄 User Schema 📄 */
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, 
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true, 
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true, 
      lowercase: true, 
      unique: true,
      max: 50,
      match: [ 
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      index: true, 
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      select: false, 
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      trim: true, 
    },
    occupation: {
      type: String,
      trim: true, 
    },
    viewedProfile: {
      type: Number,
      default: () => Math.floor(Math.random() * 10000),
    },
    impressions: {
      type: Number,
      default: () => Math.floor(Math.random() * 10000),
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }, 
  }
);

/* 👤 Virtuals 👤 */
UserSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

/* 📁 Mongoose Model 📁 */
const User = mongoose.model("User", UserSchema);
export default User;
