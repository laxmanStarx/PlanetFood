"use strict";
// import express from "express";
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
// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! );
// router.post("/create-checkout-session", async (req, res) => {
//   const { items } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: "Your Food Order",
//               },
//               unit_amount: 5000, // 50 USD in cents
//             },
//             quantity: 1,
//           },
//         ],
//         mode: "payment",
//         success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
//         cancel_url: "http://localhost:5173/cancel",
//         // metadata: {
//         //   userId: userId, // Include userId
//         //   orderId: orderId, // Include orderId
//         // },
//       });
//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// export default router;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const body_parser_1 = __importDefault(require("body-parser"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Webhook for Stripe
router.post("/webhook", body_parser_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers["stripe-signature"];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Received event type:", event.type);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            // Log session data for debugging
            console.log("Session Metadata:", session.metadata);
            // Retrieve metadata
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
            const items = JSON.parse(((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.items) || "[]");
            // Save order in the database
            console.log("Saving order with metadata:", { userId, items });
            yield prisma.order
                .create({
                data: {
                    userId: userId,
                    totalPrice: session.amount_total / 100, // Convert cents to dollars
                    status: "Paid",
                    orderItems: {
                        create: items.map((item) => ({
                            menuId: item.menuId,
                            quantity: item.quantity,
                        })),
                    },
                },
            })
                .then((order) => {
                console.log("Order saved successfully:", order);
            })
                .catch((err) => {
                console.error("Error saving order to DB:", err);
            });
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        res.status(400).send(`Webhook Error: ${err}`);
    }
}));
// Create Checkout Session
router.post("/create-checkout-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            throw new Error("Invalid 'items' in request body");
        }
        const lineItems = items.map((item) => {
            if (!item.name || !item.price || !item.quantity) {
                throw new Error(`Invalid item format: ${JSON.stringify(item)}`);
            }
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price, // Price in cents
                },
                quantity: item.quantity,
            };
        });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                userId: req.body.userId, // Ensure userId is passed in the request
                items: JSON.stringify(items),
            },
        });
        res.status(200).json({ url: session.url });
    }
    catch (err) {
        console.error("Error in /create-checkout-session:", err);
        res.status(500).json({ error: err || "Internal Server Error" });
    }
}));
exports.default = router;
// export default router;
