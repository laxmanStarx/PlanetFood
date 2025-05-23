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
// Add this to your backend code (Express server)
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
router.post("/api/recommendations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, recommendations } = req.body;
    if (!userId || !recommendations) {
        return res.status(400).json({ error: "Missing userId or recommendations" });
    }
    console.log(" Incoming data:", { userId, recommendations });
    try {
        const result = yield prisma.recommendation.upsert({
            where: { userId },
            update: { products: recommendations },
            create: { userId, products: recommendations }
        });
        console.log(" Prisma upsert result:", result);
        res.status(200).json({ success: true, message: "Recommendations saved successfully!" });
    }
    catch (error) {
        console.error("❌ Prisma error details:", (error === null || error === void 0 ? void 0 : error.message) || error);
        res.status(500).json({ error: "Failed to save recommendations" });
    }
}));
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
router.get("/api/recommendations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    try {
        // Try to find existing recommendations for the user
        const recommendation = yield prisma.recommendation.findUnique({
            where: { userId: String(userId) },
        });
        if (!recommendation) {
            // If no recommendation exists, fallback to top 5 menu items
            const fallbackMenuItems = yield prisma.menu.findMany({
                take: 2, // You can adjust this number based on your requirements
            });
            return res.status(200).json({ recommendations: fallbackMenuItems });
        }
        let productIds = recommendation.products;
        // Parse if stored as a JSON string
        if (typeof productIds === 'string') {
            try {
                productIds = JSON.parse(productIds);
            }
            catch (error) {
                console.error("Error parsing productIds:", error);
                return res.status(500).json({ error: "Failed to parse productIds" });
            }
        }
        // Check it's a valid array
        if (!Array.isArray(productIds)) {
            return res.status(400).json({ error: "Invalid recommendations format" });
        }
        // ✅ Ensure productIds is a clean string[] by filtering out non-strings
        const stringIds = productIds.filter((id) => typeof id === 'string');
        // Fetch recommended menu items from the database
        const recommendedMenus = yield prisma.menu.findMany({
            where: {
                id: { in: stringIds },
            },
        });
        // If no valid recommended menus were found, fallback to default menu items
        if (recommendedMenus.length === 0) {
            const fallbackMenuItems = yield prisma.menu.findMany({
                take: 5, // You can adjust this number based on your requirements
            });
            return res.status(200).json({ recommendations: fallbackMenuItems });
        }
        res.status(200).json({ recommendations: recommendedMenus });
    }
    catch (error) {
        console.error("Error fetching recommendations:", (error === null || error === void 0 ? void 0 : error.message) || error);
        res.status(500).json({ error: "Failed to fetch recommended products" });
    }
}));
exports.default = router;
