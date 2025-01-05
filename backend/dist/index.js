"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const foodRoute_1 = __importDefault(require("./routes/foodRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const isAdmin_1 = require("./middleware/isAdmin");
const PORT = 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/user', userRoute_1.default);
app.use('/foodRoute', foodRoute_1.default);
app.use('/admin', adminRoute_1.default);
app.use('/isAdmin', isAdmin_1.isAdmin);
app.listen(PORT, () => {
    console.log(`Your Server is listening at hello ${PORT}`);
});
