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
import recommendationRoute from  "./routes/recommendationRoute";
import ratingRoutes from "./routes/ratings";


// import paymentRoute from "./routes/paymentRoute"



const PORT = 8080
const app = express()

app.use(cors({
    origin: "*", // Specify your production frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));

 

app.use(express.json())


app.use('/api/v1/user',userRoute)
app.use('/',restaurantRoute)
app.use('/foodRoute',foodRoute)
app.use("/payment", paymentRoute);
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/isAdmin',isAdmin)
app.use('/',cartRoute)
app.use("/", uploadRoute);
app.use("/orders", orderRoute)
app.use("/api/v1/ratings", ratingRoutes)
app.use("/", recommendationRoute)







app.listen(PORT,()=>{
    console.log(`Your Server is listening at hello ${PORT}`)
})

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to your .env
  api_key: process.env.CLOUDINARY_API_KEY, // Add to your .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add to your .env
});
