import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();

app.get("/", (req, res) => {
  res.send("Backned banking project date 28-02-2026");
});

connectDB();

app.listen(3000, () => {
  console.log(`Server is running on ${3000}`);
});
