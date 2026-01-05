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
const authenticateJWT_1 = require("../middleware/authenticateJWT");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/restaurants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield prisma.restaurant.findMany({
            include: { menuItems: true }, // Include menu items if needed
        });
        res.status(200).json(restaurants);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
}));
router.get("/menu/:restaurantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    try {
        const menuItems = yield prisma.menu.findMany({
            where: { restaurantId },
        });
        res.status(200).json(menuItems);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch menu items" });
    }
}));
// router.get("/restaurants/:id/ratings", async (req:any, res) => {
//   const { id } = req.params;
//   try {
//     const ratings = await prisma.rating.findMany({
//       where: { restaurantId: id },
//     });
//     const averageRating =
//       ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length || 0;
//     res.json({ averageRating, totalRatings: ratings.length });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching ratings" });
//   }
// });
// router.post("/feedback", async (req:any, res:any) => {
//   const { restaurantId, rating, comment } = req.body;
//   if (!restaurantId || !rating || !comment) {
//     return res.status(400).json({ message: "All fields are required." });
//   }
//   try {
//     // Assuming you have a Feedback model in your database
//     await prisma.rating.create({
//       restaurantId,
//       rating,
//       comment,
//     });
//     res.status(201).json({ message: "Feedback saved successfully." });
//   } catch (error) {
//     console.error("Error saving feedback:", error);
//     res.status(500).json({ message: "Failed to save feedback." });
//   }
// });
router.post("/restaurants", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, image } = req.body;
    const { userId, role } = req.user;
    if (role !== "admin") {
        res.status(403).json({ error: "Only admin can add restaurants" });
        return;
    }
    if (!name || !address) {
        res.status(400).json({ error: "Name and address are required" });
        return;
    }
    const restaurant = yield prisma.restaurant.create({
        data: {
            name,
            address,
            image,
            adminId: userId,
        },
    });
    res.status(201).json(restaurant);
}));
// POST to add a new restaurant
// POST to add a new restaurant (admin only)
router.get("/admin/restaurant", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    if (role !== "admin") {
        return res.status(403).json({ error: "Only admin can access this." });
    }
    try {
        const restaurant = yield prisma.restaurant.findFirst({
            where: { adminId: userId },
        });
        if (!restaurant) {
            return res.status(404).json({ error: "No restaurant found for this admin." });
        }
        res.json(restaurant);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch restaurant" });
    }
}));
router.get("/api/restaurant/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const restaurant = yield prisma.restaurant.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            address: true,
            averageRating: true,
        },
    });
    if (!restaurant)
        return res.status(404).json({ message: "Not found" });
    res.json(restaurant);
}));
exports.default = router;
