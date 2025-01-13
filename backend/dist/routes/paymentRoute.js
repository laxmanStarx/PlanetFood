"use strict";
// import { Router } from "express";
// import Stripe from "stripe";
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
// const stripe = new Stripe(STRIPE_SECRET_KEY);
// const router = Router();
// router.post("/create-payment-intent", async (req:any, res:any) => {
//   const { totalAmount, currency } = req.body;
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalAmount * 100), // Stripe expects amounts in cents
//       currency: currency || "inr", // Default to INR
//       payment_method_types: ["card"],
//     });
//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     // res.status(500).json({ error: error.message });
//   }
// });
// export default router;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
router.post("/create-checkout-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Your Food Order",
                        },
                        unit_amount: 5000, // 50 USD in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cancel",
            // metadata: {
            //   userId: userId, // Include userId
            //   orderId: orderId, // Include orderId
            // },
        });
        res.json({ url: session.url });
    }
    catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).send("Internal Server Error");
    }
}));
exports.default = router;
