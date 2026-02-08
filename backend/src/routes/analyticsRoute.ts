// backend/src/routes/Analytics.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get analytics for a specific restaurant
router.get('/:restaurantId', async (req:any, res:any) => {
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
    const totalRevenueResult = await prisma.order.aggregate({
      where: {
        restaurantId: restaurantId,
        isPaid: true,
      },
      _sum: {
        totalPrice: true,
      },
    });

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: {
        restaurantId: restaurantId,
        isPaid: true,
      },
    });

    // Get last 30 days revenue
    const last30DaysRevenueResult = await prisma.order.aggregate({
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
    const last30DaysOrders = await prisma.order.count({
      where: {
        restaurantId: restaurantId,
        isPaid: true,
        paidAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get average order value
    const averageOrderResult = await prisma.order.aggregate({
      where: {
        restaurantId: restaurantId,
        isPaid: true,
      },
      _avg: {
        totalPrice: true,
      },
    });

    // Get top selling items
    const orderItemsGrouped = await prisma.orderItem.groupBy({
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
    const menuItems = await prisma.menu.findMany({
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
        menuName: menu?.name || 'Unknown',
        category: menu?.category || 'Uncategorized',
        totalQuantitySold: item._sum.quantity || 0,
        orderCount: item._count.id,
        currentPrice: menu?.price || 0,
        estimatedRevenue: (item._sum.quantity || 0) * (menu?.price || 0),
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
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

// Get analytics for all restaurants (admin)
router.get('/all/restaurants', async (req:any, res:any) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
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

    const analyticsPromises = restaurants.map(async (restaurant) => {
      const revenueResult = await prisma.order.aggregate({
        where: {
          restaurantId: restaurant.id,
          isPaid: true,
        },
        _sum: {
          totalPrice: true,
        },
      });

      const orderCount = await prisma.order.count({
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
    });

    const allAnalytics = await Promise.all(analyticsPromises);

    return res.status(200).json({
      success: true,
      data: allAnalytics,
    });
  } catch (error) {
    console.error('All restaurants analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch all restaurants analytics',
    });
  }
});

export default router;