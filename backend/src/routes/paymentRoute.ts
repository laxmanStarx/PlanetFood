






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





if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.error("🚨 Missing Stripe environment variables!");
  process.exit(1); // Stop server if env vars are missing
}




















// Use raw body for Stripe signature verification
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req:any, res:any) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      console.log("Received Stripe event:", event.type); // ✅ Debugging line

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("✅ Payment Successful for session:", session.id); // ✅ Debugging line

        // Retrieve metadata
        const userId = session.metadata?.userId;
        const items = JSON.parse(session.metadata?.items || "[]");

        if (!userId) {
          console.error("User ID is missing in metadata.");
          return res.status(400).json({ error: "Invalid user ID" });
        }

        // Find order linked to this payment
        const order = await prisma.order.findFirst({
          where: { userId: userId, status: "Pending" },
        });

        if (!order) {
          console.error("Order not found for user:", userId);
          return res.status(400).json({ error: "Order not found" });
        }

        // ✅ Update Order Status to "Paid"
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Paid" },
        });

        // ✅ Save Payment Details
        await prisma.payment.create({
          data: {
            userId,
            orderId: order.id,
            stripePaymentId: session.id,
            amount: session.amount_total! / 100,
            currency: session.currency!,
            status: "Completed",
          },
        });

        console.log("✅ Order & Payment saved for session:", session.id);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err}`);
    }
  }
);



router.post("/create-checkout-session", async (req:any, res:any) => {
  try {
    const { items, userId } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: "Invalid items" });

    //  Convert items to Stripe line_items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.max(item.price * 100, 5000), // 👈 Ensure minimum ₹50 (₹50 * 100 = 5000 paisa)
      },
      quantity: item.quantity,
    }));

    //  Calculate total price
    const totalAmount = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0);

    if (totalAmount < 5000) {
      return res.status(400).json({ error: "Minimum order amount must be ₹50." });
    }

    //  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId,
        items: JSON.stringify(items),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(" Error in /create-checkout-session:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});



export default router;











// export default router;







// import express from "express";
// import Stripe from "stripe";
// import bodyParser from "body-parser";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// // Use raw body for Stripe signature verification
// router.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"] as string;

//     try {
//       const event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;

//         // Retrieve metadata
//         const userId = session.metadata?.userId;
//         const items = JSON.parse(session.metadata?.items || "[]");

//         // Save order in the database
//         await prisma.order.create({
//           data: {
//             userId: userId!,
//             totalPrice: session.amount_total! / 100, // Convert to dollars
//             status: "Paid",
//             orderItems: {
//               create: items.map((item: any) => ({
//                 menuId: item.menuId,
//                 quantity: item.quantity,
//               })),
//             },
//           },
//         });

//         console.log("Order saved to database for session:", session.id);
//       }

//       res.status(200).json({ received: true });
//     } catch (err) {
//       console.error("Error verifying webhook:", err);
//       res.status(400).send(`Webhook Error: ${err}`);
//     }
//   }
// );



// router.post("/save-order", async (req:any, res:any) => {
//   try {
//     console.log(" Received /save-order request:", req.body);

//     const { sessionId } = req.body;
//     if (!sessionId) {
//       console.log(" Error: Missing session ID");
//       return res.status(404).json({ error: "Session ID is required" });
//     }

//     // Retrieve session from Stripe
//     const session = await stripe.checkout.sessions.retrieve(sessionId, {
//       expand: ["metadata"],
//     });

//     console.log(" Stripe Session Retrieved:", session);

//     const userId = session.metadata?.userId;
//     const items = JSON.parse(session.metadata?.items || "[]");

//     console.log(" userId:", userId);
//     console.log(" items:", items);

//     if (!userId) {
//       console.log(" Error: Missing userId");
//       return res.status(400).json({ error: "Missing userId" });
//     }
//     if (!items || items.length === 0) {
//       console.log(" Error: No items found in metadata");
//       return res.status(400).json({ error: "No items found" });
//     }

//     // Save order in the database
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         totalPrice: session.amount_total! / 100, // Convert cents to dollars
//         status: "Paid",
//         orderItems: {
//           create: items.map((item: any) => ({
//             menuId: item.menuId,
//             quantity: item.quantity,
//           })),
//         },
//       },
//     });

//     console.log(" Order saved successfully:", order);

//     res.status(200).json({ message: "Order saved successfully", order });
//   } catch (err) {
//     console.error(" Error in /save-order:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });













// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { items, userId } = req.body;

//     if (!items || !Array.isArray(items)) {
//       throw new Error("Invalid 'items' in request body");
//     }

//     const lineItems = items.map((item: any) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price, // Price in cents
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//       metadata: {
//         userId,
//         items: JSON.stringify(items),
//       },
//     });

//     res.status(200).json({ url: session.url });
//   } catch (err) {
//     console.error("Error in /create-checkout-session:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



// export default router;














