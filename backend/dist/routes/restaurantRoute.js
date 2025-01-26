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
// router.post("/ratings", async (req:any, res:any) => {
//   const { userId, restaurantId, rating, description } = req.body;
//   try {
//     // Validate userId
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid userId. User does not exist." });
//     }
//     // Validate restaurantId
//     const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
//     if (!restaurant) {
//       return res.status(400).json({ error: "Invalid restaurantId. Restaurant does not exist." });
//     }
//     // Create the rating
//     const newRating = await prisma.rating.create({
//       data: { userId, restaurantId, rating, description },
//     });
//     res.status(201).json(newRating);
//   } catch (error) {
//     console.error("Error submitting rating:", error);
//     res.status(500).json({ error: "Failed to submit rating" });
//   }
// });
exports.default = router;
