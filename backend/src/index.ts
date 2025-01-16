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

// import paymentRoute from "./routes/paymentRoute"



const PORT = 8080
const app = express()

app.use(cors({
    origin: ["https://planet-food-zoom.vercel.app"], // Specify your production frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));

 

app.use(express.json())


app.use('/api/v1/user',userRoute)
app.use('/api/v1/',restaurantRoute)
app.use('/api/v1/foodRoute',foodRoute)
app.use("/api/v1/payment", paymentRoute);
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/isAdmin',isAdmin)
app.use('/api/v1',cartRoute)







app.listen(PORT,()=>{
    console.log(`Your Server is listening at hello ${PORT}`)
})


