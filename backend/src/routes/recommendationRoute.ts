// Add this to your backend code (Express server)
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

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



  

router.get("/api/recommendations", async (req: any, res: any) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId required" });
  }

  const recommendation = await prisma.recommendation.findUnique({
    where: { userId: String(userId) },
  });

  if (!recommendation) {
    return res.status(404).json({ error: "No recommendations found" });
  }

  let productIds = recommendation.products;

  // Parse if stored as a JSON string
  if (typeof productIds === 'string') {
    try {
      productIds = JSON.parse(productIds);
    } catch (error) {
      console.error("Error parsing productIds:", error);
      return res.status(500).json({ error: "Failed to parse productIds" });
    }
  }

  // Check it's a valid array
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ error: "Invalid recommendations format" });
  }

  // ✅ Ensure productIds is a clean string[]
  const stringIds = productIds.filter((id): id is string => typeof id === 'string');

  try {
    const recommendedMenus = await prisma.menu.findMany({
      where: {
        id: { in: stringIds },
      },
    });

    // res.status(200).json({ recommendations: recommendedMenus });
    res.status(200).json({ recommendations: recommendedMenus });

  } catch (error: any) {
    console.error("Error fetching menus:", error?.message || error);
    res.status(500).json({ error: "Failed to fetch recommended products" });
  }
});









  export default router;
  