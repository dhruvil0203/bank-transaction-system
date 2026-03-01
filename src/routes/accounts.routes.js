import express from "express";
import accountController from "../controllers/account.controller.js";
import { authmiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",authmiddleware, accountController.createAccountController);

router.get("/",authmiddleware, accountController.getUserAccountController);

router.get("/balance/:accountId",authmiddleware, accountController.getAccountBalanceController);

export default router;