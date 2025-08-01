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
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {});
// Webhook to listen for Stripe events
router.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        return res.status(400).send("Missing Stripe signature");
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = (_a = paymentIntent.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
        if (orderId) {
            try {
                yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        isPaid: true,
                        paymentIntentId: paymentIntent.id,
                        paidAt: new Date(),
                    },
                });
                console.log(`Order ${orderId} marked as paid.`);
            }
            catch (err) {
                console.error("Failed to update order:", err);
                return res.status(500).send("Failed to update order");
            }
        }
        else {
            console.warn("Order ID not found in payment metadata");
        }
    }
    res.status(200).send("Received");
}));
// Example route to create a checkout session
router.post("/create-checkout-session", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, lineItems } = req.body;
        if (!orderId || !lineItems) {
            return res.status(400).json({ error: "Missing orderId or lineItems" });
        }
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                orderId,
            },
        });
        console.log("✅ CLIENT_URL:", process.env.CLIENT_URL);
        res.json({ url: session.url });
    }
    catch (err) {
        console.error("Error creating checkout session:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
