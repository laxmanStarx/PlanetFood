import express from "express";
import Stripe from "stripe";

import { PrismaClient } from "@prisma/client";



const router = express.Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

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






















router.post("/", async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error(" No Stripe signature found!");
    return res.status(400).send("Webhook Error: No signature.");
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log(" Webhook received:", event.type);
    console.log(" Event Data:", JSON.stringify(event, null, 2));

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(" Payment Successful for Session:", session.id);
      console.log("🔹 Metadata:", session.metadata);

      const userId = session.metadata?.userId;
      const orderId = session.metadata?.orderId;

      if (!userId || !orderId) {
        console.error(" Missing userId or orderId in metadata!");
        return res.status(400).json({ error: "Invalid metadata" });
      }

      console.log("🔹 Searching for order with ID:", orderId);
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order) {
        console.error(" Order not found:", orderId);
        return res.status(400).json({ error: "Order not found" });
      }

      console.log(" Order Found:", order);

      //  Update Order Status
      console.log("🔹 Updating Order Status...");
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "Paid" },
      });
      console.log(" Order Updated!");

      //  Store Payment Details
      console.log(" Storing Payment Details...");
      await prisma.payment.create({
        data: {
          userId,
          orderId,
          stripePaymentId: session.id,
          amount: session.amount_total! / 100,
          currency: session.currency!,
          status: "Completed",
        },
      });

      console.log(" Payment Details Stored Successfully!");
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error(" Webhook error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

































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
      orderId,
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



