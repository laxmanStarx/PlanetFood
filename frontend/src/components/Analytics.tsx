// frontend/src/pages/AnalyticsPage.tsx (or components/AnalyticsPage.tsx)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TopSellingItem {
  menuId: string;
  menuName: string;
  category: string;
  totalQuantitySold: number;
  orderCount: number;
  currentPrice: number;
  estimatedRevenue: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  last30DaysRevenue: number;
  last30DaysOrders: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
}
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const AnalyticsPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/analytics/${restaurantId}`
        );
        const data = await response.json();

        if (data.success) {
          setAnalytics(data.data);
        } else {
          setError('Failed to load analytics');
        }
      } catch (err) {
        setError('An error occurred while fetching analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchAnalytics();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error || 'No data available'}</div>
      </div>
    );
  }

  // Prepare chart data for top selling items
  const topItemsChartData = {
    labels: analytics.topSellingItems.map((item) => item.menuName),
    datasets: [
      {
        label: 'Quantity Sold',
        data: analytics.topSellingItems.map((item) => item.totalQuantitySold),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare revenue chart data
  const revenueChartData = {
    labels: analytics.topSellingItems.map((item) => item.menuName),
    datasets: [
      {
        label: 'Estimated Revenue ($)',
        data: analytics.topSellingItems.map((item) => item.estimatedRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="container mx-auto py-20  p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Restaurant Analytics
        </h1>
        <p className="text-gray-600">Track your restaurant's performance</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
            <svg
              className="w-8 h-8 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold mb-1">
            ${analytics.totalRevenue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm opacity-80">All time earnings</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
            <svg
              className="w-8 h-8 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold mb-1">
            {analytics.totalOrders.toLocaleString()}
          </p>
          <p className="text-sm opacity-80">Completed orders</p>
        </div>

        {/* Last 30 Days Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Last 30 Days</h3>
            <svg
              className="w-8 h-8 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold mb-1">
            ${analytics.last30DaysRevenue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm opacity-80">
            {analytics.last30DaysOrders} orders
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Avg Order Value</h3>
            <svg
              className="w-8 h-8 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold mb-1">
            ${analytics.averageOrderValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm opacity-80">Per order</p>
        </div>
      </div>

      {/* Charts Section */}
      {analytics.topSellingItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Top Selling Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Top Selling Items (Quantity)
            </h2>
            <div style={{ height: '300px' }}>
              <Bar data={topItemsChartData} options={chartOptions} />
            </div>
          </div>

          {/* Doughnut Chart - Revenue Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Revenue Distribution
            </h2>
            <div style={{ height: '300px' }}>
              <Doughnut data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Top Selling Items Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Top Selling Items
        </h2>

        {analytics.topSellingItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No orders yet</p>
            <p className="text-gray-400">
              Start receiving orders to see analytics
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Item Name
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Quantity Sold
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Orders
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Current Price
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Est. Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.topSellingItems.map((item, index) => (
                  <tr
                    key={item.menuId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {index === 0 && (
                          <span className="text-2xl mr-2">🏆</span>
                        )}
                        {index === 1 && (
                          <span className="text-2xl mr-2">🥈</span>
                        )}
                        {index === 2 && (
                          <span className="text-2xl mr-2">🥉</span>
                        )}
                        <span className="font-bold text-gray-700">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">
                        {item.menuName}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-800">
                      {item.totalQuantitySold}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      {item.orderCount}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      ${item.currentPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-green-600">
                      $
                      {item.estimatedRevenue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;