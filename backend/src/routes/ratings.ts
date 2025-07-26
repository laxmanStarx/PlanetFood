import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST: Submit a rating
router.post("/", async (req, res) => {
  const { userId, restaurantId, rating, description } = req.body;

  try {
    const newRating = await prisma.rating.create({
      data: {
        rating,
        description,
        restaurantId,
      },
    });

    // Optional: Update restaurant's average rating
    const ratings = await prisma.rating.findMany({
      where: { restaurantId },
    });

    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

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
router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        restaurant: {
          menuItems: {
            some: {
              orderItems: {
                some: {
                  order: {
                    userId: req.params.userId,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        restaurant: true,
      },
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user ratings" });
  }
});

export default router;
