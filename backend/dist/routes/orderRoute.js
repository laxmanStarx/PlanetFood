"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query; // Get userId from query parameters
    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }
    try {
        // Fetch orders for the given userId
        const orders = yield prisma.order.findMany({
            where: {
                userId: userId, // Filter by userId
            },
            include: {
                orderItems: true, // Include associated orderItems
            },
        });
        // Respond with the fetched orders
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error while fetching orders." });
    }
}));
// Order creation route in backend (Express)
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items } = req.body;
        if (!userId || !items) {
            return res.status(400).json({ error: "User ID and items are required" });
        }
        // Calculate total price
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        // Create the order in database
        const order = yield prisma.order.create({
            data: {
                userId,
                totalPrice,
                status: "Pending",
                orderItems: {
                    create: items.map((item) => ({
                        menuId: item.menuId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        // Return the created order ID
        return res.status(201).json({ orderId: order.id });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Failed to create order" });
    }
}));
exports.default = router;
