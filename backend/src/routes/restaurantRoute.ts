// import { Router, Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import { authenticateJWT } from "../middleware/authenticateJWT";

// const router = Router();
// const prisma = new PrismaClient();




// router.get("/restaurants", async (req, res) => {
//     try {
//       const restaurants = await prisma.restaurant.findMany({
//         include: { menuItems: true }, // Include menu items if needed
//       });
//       res.status(200).json(restaurants);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch restaurants" });
//     }
//   });






//   router.get("/menu/:restaurantId", async (req, res) => {
//     const { restaurantId } = req.params;
//     try {
//       const menuItems = await prisma.menu.findMany({
//         where: { restaurantId },
//       });
//       res.status(200).json(menuItems);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch menu items" });
//     }
//   });


//   // router.get("/restaurants/:id/ratings", async (req:any, res) => {
//   //   const { id } = req.params;
  
//   //   try {
//   //     const ratings = await prisma.rating.findMany({
//   //       where: { restaurantId: id },
//   //     });
  
//   //     const averageRating =
//   //       ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length || 0;
  
//   //     res.json({ averageRating, totalRatings: ratings.length });
//   //   } catch (error) {
//   //     res.status(500).json({ error: "Error fetching ratings" });
//   //   }
//   // });
  


//   // router.post("/feedback", async (req:any, res:any) => {
//   //   const { restaurantId, rating, comment } = req.body;
  
//   //   if (!restaurantId || !rating || !comment) {
//   //     return res.status(400).json({ message: "All fields are required." });
//   //   }
  
//   //   try {
//   //     // Assuming you have a Feedback model in your database
//   //     await prisma.rating.create({
//   //       restaurantId,
//   //       rating,
//   //       comment,
//   //     });
  
//   //     res.status(201).json({ message: "Feedback saved successfully." });
//   //   } catch (error) {
//   //     console.error("Error saving feedback:", error);
//   //     res.status(500).json({ message: "Failed to save feedback." });
//   //   }
//   // });













// router.post(
//   "/restaurants",
//   authenticateJWT,
//   async (req: Request, res: Response): Promise<void> => {
//     const { name, address, image } = req.body;
//     const { userId, role } = req.user!;

//     if (role !== "admin") {
//       res.status(403).json({ error: "Only admin can add restaurants" });
//       return;
//     }

//     if (!name || !address) {
//       res.status(400).json({ error: "Name and address are required" });
//       return;
//     }

//     const restaurant = await prisma.restaurant.create({
//       data: {
//         name,
//         address,
//         image,
//         adminId: userId,
//       },
//     });

//     res.status(201).json(restaurant);
//   }
// );

  
  
  
  
// // POST to add a new restaurant
// // POST to add a new restaurant (admin only)
// router.get("/admin/restaurant", authenticateJWT, async (req: any, res:any) => {
//   const { userId, role } = req.user;

//   if (role !== "admin") {
//     return res.status(403).json({ error: "Only admin can access this." });
//   }

//   try {
//     const restaurant = await prisma.restaurant.findFirst({
//       where: { adminId: userId },
//     });

//     if (!restaurant) {
//       return res.status(404).json({ error: "No restaurant found for this admin." });
//     }

//     res.json(restaurant);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch restaurant" });
//   }
// });





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














//   export default router

  







import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();
const prisma = new PrismaClient();

// GET all restaurants with revenue data
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { 
        menuItems: true,
        ratings: true 
      },
    });

    // Calculate revenue and notifications for each restaurant
    const restaurantsWithStats = await Promise.all(
      restaurants.map(async (restaurant) => {
        // Get all completed and paid orders for this restaurant
        const orders = await prisma.order.findMany({
          where: {
            // isPaid: true,
            // status: "Completed",
            orderItems: {
              some: {
                menu: {
                  restaurantId: restaurant.id,
                },
              },
            },
          },
          include: {
            orderItems: {
              where: {
                menu: {
                  restaurantId: restaurant.id,
                },
              },
              include: {
                menu: true,
              },
            },
          },
        });

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => {
          const orderRevenue = order.orderItems.reduce((itemSum, item) => {
            return itemSum + item.menu.price * item.quantity;
          }, 0);
          return sum + orderRevenue;
        }, 0);

        // Count unread notifications for this restaurant
        const unreadNotifications = await prisma.notification.count({
          where: {
            restaurantId: restaurant.id,
            isRead: false,
          },
        });

        return {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          image: restaurant.image,
          adminId: restaurant.adminId,
          averageRating: restaurant.averageRating,
          totalRevenue: totalRevenue,
          totalOrders: orders.length,
          unreadNotifications,
          menuItems: restaurant.menuItems,
        };
      })
    );

    res.status(200).json(restaurantsWithStats);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

// GET restaurant stats (revenue, orders, etc.) for a specific restaurant
router.get("/restaurants/:id/stats", async (req, res) => {
  const { id } = req.params;

  try {
    // Get all completed and paid orders for this restaurant
    const orders = await prisma.order.findMany({
      where: {
        isPaid: true,
        status: "Completed",
        orderItems: {
          some: {
            menu: {
              restaurantId: id,
            },
          },
        },
      },
      include: {
        orderItems: {
          where: {
            menu: {
              restaurantId: id,
            },
          },
          include: {
            menu: true,
          },
        },
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const orderRevenue = order.orderItems.reduce((itemSum, item) => {
        return itemSum + item.menu.price * item.quantity;
      }, 0);
      return sum + orderRevenue;
    }, 0);

    // Calculate average order value
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get top selling items
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const existing = itemSales.get(item.menuId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.menu.price * item.quantity;
        } else {
          itemSales.set(item.menuId, {
            name: item.menu.name,
            quantity: item.quantity,
            revenue: item.menu.price * item.quantity,
          });
        }
      });
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue,
      topSellingItems: topItems,
    });
  } catch (error) {
    console.error("Error fetching restaurant stats:", error);
    res.status(500).json({ error: "Failed to fetch restaurant stats" });
  }
});

// GET menu items for a specific restaurant
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

// POST to add a new restaurant (admin only)
router.post(
  "/restaurants",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    const { name, address, image } = req.body;
    const { userId, role } = req.user!;

    if (role !== "admin") {
      res.status(403).json({ error: "Only admin can add restaurants" });
      return;
    }

    if (!name || !address) {
      res.status(400).json({ error: "Name and address are required" });
      return;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        image,
        adminId: userId,
      },
    });

    res.status(201).json(restaurant);
  }
);

// GET restaurant for logged-in admin
router.get("/admin/restaurant", authenticateJWT, async (req: any, res: any) => {
  const { userId, role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only admin can access this." });
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { adminId: userId },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ error: "No restaurant found for this admin." });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

// GET notifications for logged-in admin's restaurant
router.get("/admin/notifications", authenticateJWT, async (req: any, res: any) => {
  const { userId, role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only admin can access this." });
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { adminId: userId },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ error: "No restaurant found for this admin." });
    }

    const notifications = await prisma.notification.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
          include: {
            orderItems: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
    });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark a notification as read for the logged-in admin's restaurant
router.patch("/admin/notifications/:id/read", authenticateJWT, async (req: any, res: any) => {
  const { userId, role } = req.user;
  const { id } = req.params;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only admin can access this." });
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { adminId: userId },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ error: "No restaurant found for this admin." });
    }

    const result = await prisma.notification.updateMany({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      data: {
        isRead: true,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// GET admin restaurant with detailed stats
router.get("/admin/restaurant/dashboard", authenticateJWT, async (req: any, res: any) => {
  const { userId, role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only admin can access this." });
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { adminId: userId },
      include: {
        menuItems: true,
        ratings: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "No restaurant found for this admin." });
    }

    // Get all completed and paid orders for this restaurant
    const orders = await prisma.order.findMany({
      where: {
        isPaid: true,
        status: "Completed",
        orderItems: {
          some: {
            menu: {
              restaurantId: restaurant.id,
            },
          },
        },
      },
      include: {
        orderItems: {
          where: {
            menu: {
              restaurantId: restaurant.id,
            },
          },
          include: {
            menu: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const orderRevenue = order.orderItems.reduce((itemSum, item) => {
        return itemSum + item.menu.price * item.quantity;
      }, 0);
      return sum + orderRevenue;
    }, 0);

    // Get pending orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "Pending",
        orderItems: {
          some: {
            menu: {
              restaurantId: restaurant.id,
            },
          },
        },
      },
      include: {
        orderItems: {
          include: {
            menu: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      restaurant,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        averageRating: restaurant.averageRating,
        totalMenuItems: restaurant.menuItems.length,
      },
      recentOrders: orders.slice(0, 10),
      pendingOrders: pendingOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurant dashboard" });
  }
});

// GET single restaurant details
router.get("/api/restaurant/:id", async (req: any, res: any) => {
  const { id } = req.params;
  
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        image: true,
        averageRating: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

export default router;
