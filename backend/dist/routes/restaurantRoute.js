"use strict";
// import { Router, Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import { authenticateJWT } from "../middleware/authenticateJWT";
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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticateJWT_1 = require("../middleware/authenticateJWT");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET all restaurants with revenue data
router.get("/restaurants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield prisma.restaurant.findMany({
            include: {
                menuItems: true,
                ratings: true
            },
        });
        // Calculate revenue for each restaurant
        const restaurantsWithStats = yield Promise.all(restaurants.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
            // Get all completed and paid orders for this restaurant
            const orders = yield prisma.order.findMany({
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
                },
            });
            // Calculate total revenue
            const totalRevenue = orders.reduce((sum, order) => {
                const orderRevenue = order.orderItems.reduce((itemSum, item) => {
                    return itemSum + item.menu.price * item.quantity;
                }, 0);
                return sum + orderRevenue;
            }, 0);
            return {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                image: restaurant.image,
                averageRating: restaurant.averageRating,
                totalRevenue: totalRevenue,
                totalOrders: orders.length,
                menuItems: restaurant.menuItems,
            };
        })));
        res.status(200).json(restaurantsWithStats);
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
}));
// GET restaurant stats (revenue, orders, etc.) for a specific restaurant
router.get("/restaurants/:id/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Get all completed and paid orders for this restaurant
        const orders = yield prisma.order.findMany({
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
        const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        // Get top selling items
        const itemSales = new Map();
        orders.forEach((order) => {
            order.orderItems.forEach((item) => {
                const existing = itemSales.get(item.menuId);
                if (existing) {
                    existing.quantity += item.quantity;
                    existing.revenue += item.menu.price * item.quantity;
                }
                else {
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
    }
    catch (error) {
        console.error("Error fetching restaurant stats:", error);
        res.status(500).json({ error: "Failed to fetch restaurant stats" });
    }
}));
// GET menu items for a specific restaurant
router.get("/menu/:restaurantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    try {
        const menuItems = yield prisma.menu.findMany({
            where: { restaurantId },
        });
        res.status(200).json(menuItems);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch menu items" });
    }
}));
// POST to add a new restaurant (admin only)
router.post("/restaurants", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, image } = req.body;
    const { userId, role } = req.user;
    if (role !== "admin") {
        res.status(403).json({ error: "Only admin can add restaurants" });
        return;
    }
    if (!name || !address) {
        res.status(400).json({ error: "Name and address are required" });
        return;
    }
    const restaurant = yield prisma.restaurant.create({
        data: {
            name,
            address,
            image,
            adminId: userId,
        },
    });
    res.status(201).json(restaurant);
}));
// GET restaurant for logged-in admin
router.get("/admin/restaurant", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    if (role !== "admin") {
        return res.status(403).json({ error: "Only admin can access this." });
    }
    try {
        const restaurant = yield prisma.restaurant.findFirst({
            where: { adminId: userId },
        });
        if (!restaurant) {
            return res
                .status(404)
                .json({ error: "No restaurant found for this admin." });
        }
        res.json(restaurant);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch restaurant" });
    }
}));
// GET admin restaurant with detailed stats
router.get("/admin/restaurant/dashboard", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    if (role !== "admin") {
        return res.status(403).json({ error: "Only admin can access this." });
    }
    try {
        const restaurant = yield prisma.restaurant.findFirst({
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
        const orders = yield prisma.order.findMany({
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
        const pendingOrders = yield prisma.order.findMany({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch restaurant dashboard" });
    }
}));
// GET single restaurant details
router.get("/api/restaurant/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const restaurant = yield prisma.restaurant.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ error: "Failed to fetch restaurant" });
    }
}));
exports.default = router;
