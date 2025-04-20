// Add this to your backend code (Express server)
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const router = Router();
const prisma = new PrismaClient();




// router.post("/api/recommendations", async (req:any, res:any) => {
//     const { userId, recommendations } = req.body;
  
//     // Validate or process the data as needed
//     if (!userId || !recommendations) {
//       return res.status(400).json({ error: "Missing userId or recommendations" });
//     }
  
//     // Store or process the recommendations in your database
//     try {
//       await prisma.recommendation.upsert({
//         where: { userId },
//         update: { products: recommendations },
//         create: { userId, products: recommendations }
//       });
  
//       res.status(200).json({ success: true, message: "Recommendations saved successfully!" });
//     } catch (error) {
//       console.error("Error saving recommendations:", error);
//       res.status(500).json({ error: "Failed to save recommendations" });
//     }
//   });



// router.post("/api/recommendations", async (req:any, res:any) => {
//   const { userId, recommendations } = req.body;

//   if (!userId || !recommendations) {
//     return res.status(400).json({ error: "Missing userId or recommendations" });
//   }

//   try {
//     await prisma.recommendation.upsert({
//       where: { userId },
//       update: { products: recommendations },
//       create: { userId, products: recommendations }
//     });

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("❌ Error saving recommendations:", error);
//     return res.status(500).json({ error: "Failed to save recommendations" });
//   }
// });







router.post("/api/recommendations", async (req: any, res: any) => {
  const { userId, recommendations } = req.body;

  if (!userId || !recommendations) {
    return res.status(400).json({ error: "Missing userId or recommendations" });
  }

  console.log(" Incoming data:", { userId, recommendations });

  try {
    const result = await prisma.recommendation.upsert({
      where: { userId },
      update: { products: recommendations },
      create: { userId, products: recommendations }
    });

    console.log(" Prisma upsert result:", result);
    res.status(200).json({ success: true, message: "Recommendations saved successfully!" });
  } catch (error: any) {
    console.error("❌ Prisma error details:", error?.message || error);
    res.status(500).json({ error: "Failed to save recommendations" });
  }
});






// router.get("/api/recommendations", async (req: any, res: any) => {
//   const { userId } = req.query;

//   if (!userId) {
//     return res.status(400).json({ error: "userId required" });
//   }

//   const recommendation = await prisma.recommendation.findUnique({
//     where: { userId: String(userId) },
//   });

//   if (!recommendation) {
//     return res.status(404).json({ error: "No recommendations found" });
//   }

//   let productIds = recommendation.products;

//   if (typeof productIds === 'string') {
//     try {
//       productIds = JSON.parse(productIds);
//     } catch (error) {
//       console.error("Error parsing productIds:", error);
//       return res.status(500).json({ error: "Failed to parse productIds" });
//     }
//   }

//   if (!Array.isArray(productIds)) {
//     return res.status(400).json({ error: "Invalid recommendations format" });
//   }

//   try {
//     const recommendedMenus = await prisma.menu.findMany({
//       where: {
//         id: { in: productIds },
//       },
//     });

//     res.status(200).json({ recommendations: recommendedMenus });
//   } catch (error: any) {
//     console.error("Error fetching menus:", error?.message || error);
//     res.status(500).json({ error: "Failed to fetch recommended products" });
//   }
// });



  
const RECOMMEND_API_URL = 'http://localhost:8000/recommend'; // or your Render URL

router.get('/recommend', async (req:any, res:any) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }

  try {
    const response = await axios.get(RECOMMEND_API_URL, {
      params: { user_id: userId } // FastAPI expects "user_id"
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching recommendations:');
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});










  export default router;
  