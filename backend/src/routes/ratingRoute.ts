import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST: Submit a rating
// POST /api/ratings


router.post("/", async (req, res) => {
  const { userId, restaurantId, rating, description } = req.body;

  try {
    const newRating = await prisma.rating.create({
      data: {
        rating,
        description,
        restaurant: { connect: { id: restaurantId } },
        user: { connect: { id: userId } },
      },
    });

    // Recalculate average rating
    const ratings = await prisma.rating.findMany({
      where: { restaurantId },
    });

    const avg =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { averageRating: avg },
    });

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});


// GET: Get user ratings
// GET /api/ratings/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userId: req.params.userId },
      include: { restaurant: true },
    });

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user ratings" });
  }
});


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
















export default router;
