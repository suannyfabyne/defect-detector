import mongoose from "mongoose";

export const createMongoConnection = async () => {
  try {
    console.log("Starting mongo connection...");
    await mongoose.connect("mongodb://127.0.0.1/defect-detector", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo started");
  } catch (err) {
    throw new Error("Error starting mongo service.");
  }
};
