import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();




router.get("/restaurants", async (req, res) => {
    try {
      const restaurants = await prisma.restaurant.findMany({
        include: { menuItems: true }, // Include menu items if needed
      });
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });






  router.get("/menu/:restaurantId", async (req, res) => {
    const { restaurantId } = req.params;
    try {
      const menuItems = await prisma.menu.findMany({
        where: { restaurantId },
      });
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });


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
  
  
  
  
// POST to add a new restaurant
router.post("/restaurants", async (req:any, res:any) => {
  const { name, address, image } = req.body;

  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required" });
  }

  try {
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        image: image || null, // Optional field
      },
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Failed to add restaurant" });
  }
});



router.get("/api/restaurant/:id", async (req:any, res:any) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      averageRating: true,
    },
  });

  if (!restaurant) return res.status(404).json({ message: "Not found" });
  res.json(restaurant);
})














  export default router

  