






// import express from "express";
// import Stripe from "stripe";

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










import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Webhook for Stripe
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      console.log("Received event type:", event.type);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Log session data for debugging
        console.log("Session Metadata:", session.metadata);

        // Retrieve metadata
        const userId = session.metadata?.userId;
        const items = JSON.parse(session.metadata?.items || "[]");

        // Save order in the database
        console.log("Saving order with metadata:", { userId, items });
        await prisma.order
          .create({
            data: {
              userId: userId!,
              totalPrice: session.amount_total! / 100, // Convert cents to dollars
              status: "Paid",
              orderItems: {
                create: items.map((item: any) => ({
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
    } catch (err) {
      console.error("Error verifying webhook:", err);
      res.status(400).send(`Webhook Error: ${err}`);
    }
  }
);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      throw new Error("Invalid 'items' in request body");
    }

    const lineItems = items.map((item: any) => {
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

    const session = await stripe.checkout.sessions.create({
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
  } catch (err) {
    console.error("Error in /create-checkout-session:", err);
    res.status(500).json({ error: err || "Internal Server Error" });
  }
});

export default router;











// export default router;




