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
// Use raw body for Stripe signature verification
router.post("/webhook", body_parser_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers["stripe-signature"];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            // Retrieve metadata
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
            const items = JSON.parse(((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.items) || "[]");
            // Save order in the database
            yield prisma.order.create({
                data: {
                    userId: userId,
                    totalPrice: session.amount_total / 100, // Convert to dollars
                    status: "Paid",
                    orderItems: {
                        create: items.map((item) => ({
                            menuId: item.menuId,
                            quantity: item.quantity,
                        })),
                    },
                },
            });
            console.log("Order saved to database for session:", session.id);
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        res.status(400).send(`Webhook Error: ${err}`);
    }
}));
exports.default = router;
// export default router;
