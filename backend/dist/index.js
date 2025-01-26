"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const foodRoute_1 = __importDefault(require("./routes/foodRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const cors_1 = __importDefault(require("cors"));
const isAdmin_1 = require("./middleware/isAdmin");
const restaurantRoute_1 = __importDefault(require("./routes/restaurantRoute"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
// import paymentRoute from "./routes/paymentRoute"
const PORT = 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // Specify your production frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express_1.default.json());
app.use('/api/v1/user', userRoute_1.default);
app.use('/', restaurantRoute_1.default);
app.use('/foodRoute', foodRoute_1.default);
app.use("/payment", paymentRoute_1.default);
app.use('/api/v1/admin', adminRoute_1.default);
app.use('/api/v1/isAdmin', isAdmin_1.isAdmin);
app.use('/', cartRoute_1.default);
app.use("/", uploadRoute_1.default);
app.listen(PORT, () => {
    console.log(`Your Server is listening at hello ${PORT}`);
});
// Initialize Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to your .env
    api_key: process.env.CLOUDINARY_API_KEY, // Add to your .env
    api_secret: process.env.CLOUDINARY_API_SECRET, // Add to your .env
});
