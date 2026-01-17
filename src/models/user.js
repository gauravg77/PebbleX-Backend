import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["SUPPLIER", "VENDOR", "ADMIN"],
      default: "VENDOR",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    phone: {
      type: Number,
      default: null
    },
    address: {
      type: String,
      required: true
    },
    // Added for Password Reset Logic
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true
  }
);

// Hash password before saving
ModelSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
ModelSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", ModelSchema);

export default UserModel;