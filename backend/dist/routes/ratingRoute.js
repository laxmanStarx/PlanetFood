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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST: Submit a rating
// POST /api/ratings
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, restaurantId, rating, description } = req.body;
    try {
        const newRating = yield prisma.rating.create({
            data: {
                rating,
                description,
                restaurant: { connect: { id: restaurantId } },
                user: { connect: { id: userId } },
            },
        });
        // Recalculate average rating
        const ratings = yield prisma.rating.findMany({
            where: { restaurantId },
        });
        const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        yield prisma.restaurant.update({
            where: { id: restaurantId },
            data: { averageRating: avg },
        });
        res.status(201).json(newRating);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit rating" });
    }
}));
// GET: Get user ratings
// GET /api/ratings/user/:userId
router.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratings = yield prisma.rating.findMany({
            where: { userId: req.params.userId },
            include: { restaurant: true },
        });
        res.json(ratings);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch user ratings" });
    }
}));
// router.get("/api/restaurant/:id", async (req:any, res:any) => {
//   const { id } = req.params;
//   const restaurant = await prisma.restaurant.findUnique({
//     where: { id },
//     select: {
//       id: true,
//       name: true,
//       address: true,
//       averageRating: true,
//     },
//   });
//   if (!restaurant) return res.status(404).json({ message: "Not found" });
//   res.json(restaurant);
// })
exports.default = router;
