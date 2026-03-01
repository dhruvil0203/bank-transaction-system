import { Router } from "express";
import { authmiddleware, authsystemUserMiddleware } from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transfer",authmiddleware,transactionController.createTransactionController);

router.post("/system/initial-funds",authsystemUserMiddleware,transactionController.creditIntialFundTransaction);

export default router; 