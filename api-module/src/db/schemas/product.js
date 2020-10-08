import mongoose from "mongoose";
const Schema = mongoose.Schema;

var productSchema = new Schema({
  code: { type: String, required: true },
  product: { type: String, required: true },
  type: { type: String, required: true },
  defective: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
