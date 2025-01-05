import express from "express"

import foodRoute from "./routes/foodRoute";
import userRoute from "./routes/userRoute"
import adminRoute from "./routes/adminRoute";
import jwt from "jsonwebtoken";
import { isAdmin } from "./middleware/isAdmin";



const PORT = 8080
const app = express()



app.use(express.json())
app.use('/api/v1/user',userRoute)
app.use('/foodRoute',foodRoute)
app.use('/admin',adminRoute)
app.use('/isAdmin',isAdmin)







app.listen(PORT,()=>{
    console.log(`Your Server is listening at hello ${PORT}`)
})

