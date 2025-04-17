// Add this to your backend code (Express server)
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();




router.post("/api/recommendations", async (req:any, res:any) => {
    const { userId, recommendations } = req.body;
  
    // Validate or process the data as needed
    if (!userId || !recommendations) {
      return res.status(400).json({ error: "Missing userId or recommendations" });
    }
  
    // Store or process the recommendations in your database
    try {
      await prisma.recommendation.upsert({
        where: { userId },
        update: { products: recommendations },
        create: { userId, products: recommendations }
      });
  
      res.status(200).json({ success: true, message: "Recommendations saved successfully!" });
    } catch (error) {
      console.error("Error saving recommendations:", error);
      res.status(500).json({ error: "Failed to save recommendations" });
    }
  });




  router.post("/api/recommendations", async (req:any, res:any) => {
    const { userId, recommendations } = req.body;
  
    if (!userId || !recommendations) {
      return res.status(400).json({ error: "Missing userId or recommendations" });
    }
  
    try {
      await prisma.recommendation.upsert({
        where: { userId },
        update: { products: recommendations },
        create: { userId, products: recommendations }
      });
  
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error saving recommendations:", error);
      return res.status(500).json({ error: "Failed to save recommendations" });
    }
  });
  









  export default router;
  