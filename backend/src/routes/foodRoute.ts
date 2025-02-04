import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Fetch all menu items
router.get("/", async (req, res) => {
  try {
    const menus = await prisma.menu.findMany();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// Fetch a single menu item by ID
router.get("/:id", async (req:any, res:any) => {
  const { id } = req.params;
  try {
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) return res.status(404).json({ error: "Menu item not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});



// Fetch menu items by category
// router.get("/category/:category", async (req, res) => {
//   const { category } = req.params;
//   try {
//     const menus = await prisma.menu.findMany({ where: { category } });
//     res.json(menus);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch menu items by category" });
//   }
// });







// router.get("/", async (req:any, res:any) => {
//   const { userId } = req.query;  // Get userId from query parameters

//   // Check if userId is provided
//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required." });
//   }

//   try {
//     // Fetch orders for the given userId
//     const orders = await prisma.order.findMany({
//       where: {
//         userId: userId,  // Filter by userId
//       },
//       include: {
//         orderItems: true,  // Include associated orderItems
//       },
//     });

//     // Respond with the fetched orders
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ error: "Internal server error while fetching orders." });
//   }
// });






















// // Order creation route in backend (Express)
// router.post("/", async (req:any, res:any) => {
//   try {
//     const { userId, items } = req.body;

//     if (!userId || !items) {
//       return res.status(400).json({ error: "User ID and items are required" });
//     }

//     // Calculate total price
//     const totalPrice = items.reduce((total:any, item:any) => total + item.price * item.quantity, 0);

//     // Create the order in database
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         totalPrice,
//         status: "Pending",
//         orderItems: {
//           create: items.map((item:any) => ({
//             menuId: item.menuId,
//             quantity: item.quantity,
//           })),
//         },
//       },
//     });

//     // Return the created order ID
//     return res.status(201).json({ orderId: order.id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ error: "Failed to create order" });
//   }
// });












export default router;
