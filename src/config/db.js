import mongoose from "mongoose";

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Server is connected successfully`);
    })
    .catch((error) => {
      console.log(`Error while connecting to server ${error}`);
      process.exit(1);
    });
}

export default connectDB;
