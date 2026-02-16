import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: String,

  images: {
    type: [String],  // Array of strings
    default: []
  },

  stock: {  // Added stock field (useful for your frontend)
    type: Number,
    default: 0
  },

  isNew: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

export default mongoose.model("Products", productSchema);