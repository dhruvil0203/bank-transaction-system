import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import ledgerModel from "../models/ledger.model.js";
import mongoose from "mongoose";

async function createTransactionController(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
            status: "failed"
        });
    }

    const fromaccount = await accountModel.findById(fromAccount);
    const toaccount = await accountModel.findById(toAccount);

    if (!fromaccount || !toaccount) {
        return res.status(404).json({
            message: "Invalid FromAccount or ToAccount",
            status: "failed"
        });
    }

    const isTransactionAlreadyProcessed = await transactionModel.findOne({ idempotencyKey });

    if (isTransactionAlreadyProcessed) {
        if (isTransactionAlreadyProcessed.status === "success") {
            return res.status(200).json({ message: "Transaction already processed", status: "success" });
        }
        if (isTransactionAlreadyProcessed.status === "failed") {
            return res.status(400).json({ message: "Transaction failed", status: "failed" });
        }
        if (isTransactionAlreadyProcessed.status === "pending") {
            return res.status(400).json({ message: "Transaction is pending", status: "pending" });
        }
        if (isTransactionAlreadyProcessed.status === "reversed") {
            return res.status(400).json({ message: "Transaction is reversed so please try again", status: "reversed" });
        }
    }

    if (fromaccount.status !== "Active" || toaccount.status !== "Active") {
        return res.status(400).json({
            message: "FromAccount or ToAccount is not active",
            status: "failed"
        });
    }

    const balance = await fromaccount.getbalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance} and you are trying to transfer ${amount}`,
            status: "failed"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await transactionModel.create([
            { fromAccount, toAccount, amount, idempotencyKey, status: "pending" }
        ], { session });

        const debitLedger = await ledgerModel.create([
            { account: fromaccount._id, amount, transaction: transaction[0]._id, type: "debit" }
        ], { session });

        const creditLedger = await ledgerModel.create([
            { account: toaccount._id, amount, transaction: transaction[0]._id, type: "credit" }
        ], { session });

        transaction[0].status = "success";
        await transaction[0].save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Transaction created successfully",
            status: "success"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        return res.status(500).json({ message: "Transaction failed", status: "failed", error: error.message });
    }
}

async function creditIntialFundTransaction(req, res) {
    const { toaccount, amount, idempotencyKey } = req.body;

    if (!toaccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
            status: "failed"
        });
    }

    const toAccount = await accountModel.findById(toaccount);

    if (!toAccount) {
        return res.status(404).json({
            message: "Invalid ToAccount",
            status: "failed"
        });
    }

    const fromUserAccount = await accountModel.findOne({
        userId: req.user._id,
    });

    if (!fromUserAccount) {
        return res.status(404).json({
            message: "System user account not found",
            status: "failed"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await transactionModel.create([
            { fromAccount: fromUserAccount._id, toAccount: toAccount._id, amount, idempotencyKey, status: "pending" }
        ], { session });

        await ledgerModel.create([
            { account: fromUserAccount._id, amount, transaction: transaction[0]._id, type: "debit" }
        ], { session });

        await ledgerModel.create([
            { account: toAccount._id, amount, transaction: transaction[0]._id, type: "credit" }
        ], { session });

        transaction[0].status = "success";
        await transaction[0].save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Transaction created successfully",
            status: "success"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        return res.status(500).json({ message: "Transaction failed", status: "failed", error: error.message });
    }
}

export default {
    createTransactionController,
    creditIntialFundTransaction
}