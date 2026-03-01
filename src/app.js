import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/accounts.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Health check route to verify server status
app.get('/',(req,res)=>{
    res.send("Server is running up and running")
})

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transaction", transactionRouter);

export default app;
