import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// Middleware to check admin role
const isAdmin = async (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a menu item
router.post("/menu", isAdmin, async (req, res) => {
  const { name, description, price, image, restaurantId } = req.body;
  try {
    // console.log("Creating menu item with data:", { name, description, price, image, restaurantId });
    const menu = await prisma.menu.create({
      data: { name, description, price, image, restaurantId },
    });
    res.status(201).json(menu);
  } catch (error) {
    console.error("Error adding menu item:", error); 
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Update a menu item
router.put("/menu/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;
  try {
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: { name, description, price, image },
    });
    res.json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete a menu item
router.delete("/menu/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.menu.delete({ where: { id } });
    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;
