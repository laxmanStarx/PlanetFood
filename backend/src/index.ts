import express from "express"

import foodRoute from "./routes/foodRoute";
import userRoute from "./routes/userRoute"
import adminRoute from "./routes/adminRoute";
import jwt from "jsonwebtoken";
import cors from 'cors'
import { isAdmin } from "./middleware/isAdmin";

import restaurantRoute from "./routes/restaurantRoute";
import cartRoute from "./routes/cartRoute";
import paymentRoute from "./routes/paymentRoute";
import cloudinary from "cloudinary"
import uploadRoute from "./routes/uploadRoute";
import orderRoute from "./routes/orderRoute";
// import recommendationRoute from  "./routes/recommendationRoute";
import ratingRoutes from "./routes/ratingRoute";
import ratings from "./routes/ratingRoute";
import ratingRoute from "./routes/ratingRoute";


import webhookRoute from "./routes/webhookRoute";
import bodyParser from "body-parser";


// import paymentRoute from "./routes/paymentRoute"



const PORT = 8080
const app = express()

//  app.use("/payment/webhook", bodyParser.raw({ type: "application/json" }), webhookRoute);

app.use(cors({
    origin: "*", // Specify your production frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }));


 app.use("/payment/webhook", express.raw({ type: "application/json" }),webhookRoute);

 

app.use(express.json())


app.use('/api/v1/user',userRoute)
app.use('/',restaurantRoute)
app.use('/foodRoute',foodRoute)
app.use("/paymentorder", paymentRoute);
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/isAdmin',isAdmin)
app.use('/',cartRoute)

app.use("/", uploadRoute);
// app.use("/payment", webhookRoute); 
app.use("/orders", orderRoute)
app.use("/api/ratings", ratingRoute)
// app.use("/", recommendationRoute)







app.listen(PORT,()=>{
    console.log(`Your Server is listening at hello ${PORT}`)
})

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to your .env
  api_key: process.env.CLOUDINARY_API_KEY, // Add to your .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add to your .env
});














// i had different menu id,  for different restaurants, based on that menuId and price tag, i want to show total sales with amount in admin dashboard , and this sales only visible to admins only