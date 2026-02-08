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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/Analytics.ts
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get analytics for a specific restaurant
router.get('/:restaurantId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                error: 'Restaurant ID is required',
            });
        }
        // Calculate 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        // Get total revenue
        const totalRevenueResult = yield prisma.order.aggregate({
            where: {
                restaurantId: restaurantId,
                isPaid: true,
            },
            _sum: {
                totalPrice: true,
            },
        });
        // Get total orders
        const totalOrders = yield prisma.order.count({
            where: {
                restaurantId: restaurantId,
                isPaid: true,
            },
        });
        // Get last 30 days revenue
        const last30DaysRevenueResult = yield prisma.order.aggregate({
            where: {
                restaurantId: restaurantId,
                isPaid: true,
                paidAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _sum: {
                totalPrice: true,
            },
        });
        // Get last 30 days orders count
        const last30DaysOrders = yield prisma.order.count({
            where: {
                restaurantId: restaurantId,
                isPaid: true,
                paidAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });
        // Get average order value
        const averageOrderResult = yield prisma.order.aggregate({
            where: {
                restaurantId: restaurantId,
                isPaid: true,
            },
            _avg: {
                totalPrice: true,
            },
        });
        // Get top selling items
        const orderItemsGrouped = yield prisma.orderItem.groupBy({
            by: ['menuId'],
            where: {
                order: {
                    restaurantId: restaurantId,
                    isPaid: true,
                },
            },
            _sum: {
                quantity: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        });
        // Fetch menu details for top items
        const menuIds = orderItemsGrouped.map((item) => item.menuId);
        const menuItems = yield prisma.menu.findMany({
            where: {
                id: {
                    in: menuIds,
                },
            },
        });
        // Combine data
        const topSellingItems = orderItemsGrouped.map((item) => {
            const menu = menuItems.find((m) => m.id === item.menuId);
            return {
                menuId: item.menuId,
                menuName: (menu === null || menu === void 0 ? void 0 : menu.name) || 'Unknown',
                category: (menu === null || menu === void 0 ? void 0 : menu.category) || 'Uncategorized',
                totalQuantitySold: item._sum.quantity || 0,
                orderCount: item._count.id,
                currentPrice: (menu === null || menu === void 0 ? void 0 : menu.price) || 0,
                estimatedRevenue: (item._sum.quantity || 0) * ((menu === null || menu === void 0 ? void 0 : menu.price) || 0),
            };
        });
        const analytics = {
            totalRevenue: totalRevenueResult._sum.totalPrice || 0,
            totalOrders,
            last30DaysRevenue: last30DaysRevenueResult._sum.totalPrice || 0,
            last30DaysOrders,
            averageOrderValue: averageOrderResult._avg.totalPrice || 0,
            topSellingItems,
        };
        return res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error('Analytics error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics',
        });
    }
}));
// Get analytics for all restaurants (admin)
router.get('/all/restaurants', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield prisma.restaurant.findMany({
            include: {
                _count: {
                    select: {
                        menuItems: true,
                        ratings: true,
                        orders: true,
                    },
                },
            },
        });
        const analyticsPromises = restaurants.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
            const revenueResult = yield prisma.order.aggregate({
                where: {
                    restaurantId: restaurant.id,
                    isPaid: true,
                },
                _sum: {
                    totalPrice: true,
                },
            });
            const orderCount = yield prisma.order.count({
                where: {
                    restaurantId: restaurant.id,
                    isPaid: true,
                },
            });
            return {
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                totalRevenue: revenueResult._sum.totalPrice || 0,
                totalOrders: orderCount,
                averageRating: restaurant.averageRating || 0,
                menuItemsCount: restaurant._count.menuItems,
                ratingsCount: restaurant._count.ratings,
            };
        }));
        const allAnalytics = yield Promise.all(analyticsPromises);
        return res.status(200).json({
            success: true,
            data: allAnalytics,
        });
    }
    catch (error) {
        console.error('All restaurants analytics error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch all restaurants analytics',
        });
    }
}));
exports.default = router;
