"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config");
const stripe = new stripe_1.default(config_1.STRIPE_SECRET_KEY);
const router = (0, express_1.Router)();
router.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalAmount, currency } = req.body;
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Stripe expects amounts in cents
            currency: currency || "inr", // Default to INR
            payment_method_types: ["card"],
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error("Error creating payment intent:", error);
        // res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
