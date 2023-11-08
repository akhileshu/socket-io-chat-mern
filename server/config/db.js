import mongoose from "mongoose";

export async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB ", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit();
  }
}
