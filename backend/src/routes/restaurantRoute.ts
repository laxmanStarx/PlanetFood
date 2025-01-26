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
  
  
  


















  export default router

  