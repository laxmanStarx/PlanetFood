






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

// Use raw body for Stripe signature verification
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

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve metadata
        const userId = session.metadata?.userId;
        const items = JSON.parse(session.metadata?.items || "[]");

        // Save order in the database
        await prisma.order.create({
          data: {
            userId: userId!,
            totalPrice: session.amount_total! / 100, // Convert to dollars
            status: "Paid",
            orderItems: {
              create: items.map((item: any) => ({
                menuId: item.menuId,
                quantity: item.quantity,
              })),
            },
          },
        });

        console.log("Order saved to database for session:", session.id);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      res.status(400).send(`Webhook Error: ${err}`);
    }
  }
);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body; // Expecting items from frontend

    // Map items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price, // Price in cents
      },
      quantity: item.quantity,
    }));

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect on success
      cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect on cancellation
      metadata: {
        items: JSON.stringify(items), // Pass metadata for webhook
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating Checkout Session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});


export default router;











// export default router;




