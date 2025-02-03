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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Fetch all menu items
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma.menu.findMany();
        res.json(menus);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch menu" });
    }
}));
// Fetch a single menu item by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const menu = yield prisma.menu.findUnique({ where: { id } });
        if (!menu)
            return res.status(404).json({ error: "Menu item not found" });
        res.json(menu);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch menu item" });
    }
}));
// Fetch menu items by category
// router.get("/category/:category", async (req, res) => {
//   const { category } = req.params;
//   try {
//     const menus = await prisma.menu.findMany({ where: { category } });
//     res.json(menus);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch menu items by category" });
//   }
// });
router.get("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items } = req.body;
    // Check if userId and items are provided
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "User ID and items are required." });
    }
    // Calculate total price
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    try {
        // Create an order with associated order items
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
            include: {
                orderItems: true,
            },
        });
        // Respond with the created order
        res.status(201).json(order);
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error while creating order." });
    }
}));
exports.default = router;
