import express from "express";
import Stripe from "stripe";

import { PrismaClient } from "@prisma/client";



const router = express.Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

// Webhook to listen for Stripe events
router.post(
  "/",
  
  async (req:any, res:any) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
       console.log("Hello signature")
      return res.status(400).send("Missing Stripe signature");
      
    }
   

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

       console.log(" Webhook event received:", event.type);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;



        console.log("✅ Webhook triggered");

  console.log("✅ Stripe Metadata:", paymentIntent.metadata);
  
  console.log("✅ Extracted orderId:", orderId);

  if (!orderId) {
    console.warn("⚠️ Order ID is missing in payment metadata");
    return res.status(400).send("Order ID not found");
  }















      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              isPaid: true,
              paymentIntentId: paymentIntent.id,
              paidAt: new Date(),
            },

          });
          console.log(`Order ${orderId} marked as paid.`);
        } catch (err) {
          console.error("Failed to update order:", err);
          return res.status(500).send("Failed to update order");
        }
      } else {
        console.warn("Order ID not found in payment metadata");
      }
    }

    res.status(200).send("Received");
  }
);

// Example route to create a checkout session
router.post("/create-checkout-session", express.json(), async (req:any, res:any) => {
  try {
    const { orderId, lineItems } = req.body;

    if (!orderId || !lineItems) {
      return res.status(400).json({ error: "Missing orderId or lineItems" });
    }

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items: lineItems,
  success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  payment_intent_data: {
    metadata: {
      orderId, // ✅ THIS will be available in webhook
    },
  },
});

    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;



