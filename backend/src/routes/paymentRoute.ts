
// import { Router } from "express";
// import Stripe from "stripe";


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






import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! );

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;






