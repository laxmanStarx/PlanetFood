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
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {});
// Webhook to listen for Stripe events
// router.post(
//   "/",
//   async (req:any, res:any) => {
//     const sig = req.headers["stripe-signature"];
//     if (!sig) {
//        console.log("Hello signature")
//       return res.status(400).send("Missing Stripe signature");
//     }
//     let event: Stripe.Event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );
//        console.log(" Webhook event received:", event.type);
//     } catch (err: any) {
//       console.error("Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//     if (event.type === "payment_intent.succeeded") {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       const orderId = paymentIntent.metadata?.orderId;
//       if (orderId) {
//         try {
//           await prisma.order.update({
//             where: { id: orderId },
//             data: {
//               isPaid: true,
//               paymentIntentId: paymentIntent.id,
//               paidAt: new Date(),
//             },
//           });
//           console.log(`Order ${orderId} marked as paid.`);
//         } catch (err) {
//           console.error("Failed to update order:", err);
//           return res.status(500).send("Failed to update order");
//         }
//       } else {
//         console.warn("Order ID not found in payment metadata");
//       }
//     }
//     res.status(200).send("Received");
//   }
// );
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("✅ Stripe Event Received:", event.type);
    }
    catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Listen to Checkout Session Completed
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
        const userId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.userId;
        if (!orderId) {
            console.warn("⚠️ No orderId in metadata");
            return res.status(400).send("Missing orderId in metadata");
        }
        try {
            yield prisma.order.update({
                where: { id: orderId },
                data: {
                    isPaid: true,
                    status: "Paid",
                    paymentIntentId: (_d = (_c = session.payment_intent) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                    paidAt: new Date(),
                },
            });
            yield prisma.payment.create({
                data: {
                    userId: userId !== null && userId !== void 0 ? userId : "unknown",
                    orderId: orderId,
                    stripePaymentId: session.id,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    status: "Completed",
                },
            });
            console.log(` Order ${orderId} marked as Paid`);
        }
        catch (err) {
            console.error(" DB Update Failed:", err);
            return res.status(500).send("DB update error");
        }
    }
    return res.status(200).json({ received: true });
}));
// Example route to create a checkout session
// router.post("/create-checkout-session", express.json(), async (req:any, res:any) => {
//   try {
//     const { orderId, lineItems } = req.body;
//     if (!orderId || !lineItems) {
//       return res.status(400).json({ error: "Missing orderId or lineItems" });
//     }
// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   mode: "payment",
//   line_items: lineItems,
//   success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//   cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//   payment_intent_data: {
//     metadata: {
//       orderId,
//     },
//   },
// });
//     console.log("CLIENT_URL:", process.env.CLIENT_URL);
//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Error creating checkout session:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// 1:19AM
// router.post("/create-checkout-session", async (req:any, res:any) => {
//   try {
//     const { orderId, lineItems, userId } = req.body;
//     if (!orderId || !lineItems || !userId) {
//       return res.status(400).json({ error: "Missing orderId, lineItems or userId" });
//     }
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//       metadata: {
//         orderId,   // ✅ orderId exists
//         userId,    // ✅ userId also now exists
//       },
//     });
//     return res.status(200).json({ url: session.url });
//   } catch (err) {
//     console.error("Checkout session error:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
exports.default = router;
