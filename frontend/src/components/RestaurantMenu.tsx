// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface Restaurant {
//   id: string;
//   name: string;
//   address: string;
//   image: string;
//   averageRating?: number;
// }

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const RestaurantMenu = () => {
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/restaurants`);
//         const data = await response.json();
//         setRestaurants(data);
//       } catch (error) {
//         console.error("Error fetching restaurants:", error);
//       }
//     };
//     fetchRestaurants();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {restaurants.map((restaurant) => (
//           <div
//             key={restaurant.id}
//             className="bg-white shadow-lg rounded-lg overflow-hidden 
//             hover:shadow-xl transition-shadow duration-300 cursor-pointer 
//             animate-rgbGlow"
//             onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
//           >
//             <img
//               src={restaurant.image}
//               alt={restaurant.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {restaurant.name}
//               </h2>
//               <p className="text-sm text-gray-500">{restaurant.address}</p>
//             </div>
//             <div className="p-4 border-t text-center text-blue-500 font-semibold">
//               View Details
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tailwind Custom Animation */}
//       <style>
//   {`
//     @keyframes rgbGlow {
//       0% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Moderate Red */
//       33% { box-shadow: 0 0 20px 4px rgba(0, 255, 0, 0.7); } /* Moderate Green */
//       66% { box-shadow: 0 0 25px 5px rgba(0, 0, 255, 0.7); } /* Moderate Blue */
//       100% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Back to Red */
//     }

//     .animate-rgbGlow {
//       animation: rgbGlow 2.8s infinite alternate ease-in-out;
//       filter: brightness(1.15); /* Slightly boosted brightness */
//     }
//   `}
// </style>

//     </div>
//   );
// };

// export default RestaurantMenu;







// how can i display ratings in this cards 

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RecommendationSection from "./Recommendatin";



// interface Restaurant {
//   id: string;
//   name: string;
//   address: string;
//   image: string;
//   averageRating?: number;
// }




// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const RestaurantMenu = () => {
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
 

//   // const [recommendations, setRecommendations] = useState<string[]>([]);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem('userId');  // You can dynamically pass this value as needed

//   useEffect(() => {
//     // Fetch restaurants
//     const fetchRestaurants = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/restaurants`);
//         const data = await response.json();
//         setRestaurants(data);
//       } catch (error) {
//         console.error("Error fetching restaurants:", error);
//       }
//     };









    

//     fetchRestaurants();
   
//   }, [userId]);





//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>
// <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//   {[...restaurants]
//     .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
//     .map((restaurant) => (
//       <div
//         key={restaurant.id}
//         className="bg-white shadow-lg rounded-lg overflow-hidden 
//         hover:shadow-xl transition-shadow duration-300 cursor-pointer 
//         animate-rgbGlow"
//         onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
//       >
//         <img
//           src={restaurant.image}
//           alt={restaurant.name}
//           className="w-full h-48 object-cover"
//         />
//         <div className="p-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {restaurant.name}
//           </h2>
//           <p className="text-sm text-gray-500">{restaurant.address}</p>

//           {restaurant.averageRating !== undefined && (
//             <p className=" text-red-900 text-md mt-1">
// <div className="flex items-center mt-2 space-x-1">
//   {[1, 2, 3, 4, 5].map((i) => (
//     <div key={i} className="flex">
//       {(restaurant.averageRating ?? 0) >= i ? (
//         <img
//           src="https://res.cloudinary.com/dykahal7o/image/upload/v1753708074/Screenshot_2025-07-28_183741_jbe6nr.png"
//           alt="rating bubble"
//           className="w-6 h-6"
//         />
//       ) : (
//         <div className="w-4 h-4 bg-gray-300 rounded-full" />
//       )}
//     </div>
//   ))}
// </div>


//             </p>
//           )}
//         </div>
//         <div className="p-4 border-t text-center text-yellow-500 font-semibold">
//           View Details
//         </div>
//       </div>
//     ))}
// </div>


//       {/* Recommendations Section */}
//       <div className="mt-16">
//         {/* <h2 className="text-2xl font-bold text-center mb-6">Recommended for You</h2> */}

//         {/* <RecommendationSection userId="cm5l4omqb0wgyf7wehd" /> */}
//         <RecommendationSection  userId={userId} /> 


        
//       </div>

//       {/* Tailwind Custom Animation */}
//       <style>
//         {`
//           @keyframes rgbGlow {
//             0% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Moderate Red */
//             33% { box-shadow: 0 0 20px 4px rgba(0, 255, 0, 0.7); } /* Moderate Green */
//             66% { box-shadow: 0 0 25px 5px rgba(0, 0, 255, 0.7); } /* Moderate Blue */
//             100% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Back to Red */
//           }

//           .animate-rgbGlow {
//             animation: rgbGlow 2.8s infinite alternate ease-in-out;
//             filter: brightness(1.15); /* Slightly boosted brightness */
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default RestaurantMenu;


// cm5l4omqb0000tt5wgyf7wehd
// cm5l4omqb0000tt5wgyf7wehd































// RestaurantMenu.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "./Recommendatin";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string;
  adminId?: string;
  averageRating?: number;
  totalRevenue?: number;  // Add this
  totalOrders?: number;   // Add this
  unreadNotifications?: number;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RestaurantMenu = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${backendUrl}/restaurants`);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [userId]);

  // Read and mark notifications as read for this admin's restaurant
  const handleNotificationClick = async (restaurantId: string) => {
    if (!token) {
      console.warn("No auth token found; cannot read notifications.");
      return;
    }

    try {
      // Fetch all notifications for this admin's restaurant
      const res = await fetch(`${backendUrl}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch notifications");
        return;
      }

      const notifications: { id: string; isRead: boolean }[] = await res.json();

      // Mark all unread as read
      const unread = notifications.filter((n) => !n.isRead);

      await Promise.all(
        unread.map((n) =>
          fetch(`${backendUrl}/admin/notifications/${n.id}/read`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      // Optionally log or handle the notifications list here
      console.log("Notifications:", notifications);

      // Update local state so the badge disappears
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId ? { ...r, unreadNotifications: 0 } : r
        )
      );
    } catch (err) {
      console.error("Error reading notifications:", err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...restaurants]
          .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
          .map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden 
              hover:shadow-xl transition-shadow duration-300 cursor-pointer 
              animate-rgbGlow"
              onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {restaurant.name}
                </h2>
                <p className="text-sm text-gray-500">{restaurant.address}</p>

                {/* Admin notification badge */}
                {userId === restaurant.adminId &&
                  (restaurant.unreadNotifications ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(restaurant.id);
                      }}
                      className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                    >
                      {restaurant.unreadNotifications} new order
                      {restaurant.unreadNotifications! > 1 ? "s" : ""} - View
                    </button>
                  )}

                {/* Rating Display */}
                {restaurant.averageRating !== undefined && (
                  <div className="flex items-center mt-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex">
                        {(restaurant.averageRating ?? 0) >= i ? (
                          <img
                            src="https://res.cloudinary.com/dykahal7o/image/upload/v1753708074/Screenshot_2025-07-28_183741_jbe6nr.png"
                            alt="rating bubble"
                            className="w-6 h-6"
                          />
                        ) : (
                          <div className="w-4 h-4 bg-gray-300 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Revenue Display */}
{/* Revenue Display - Ensure it shows even if revenue is 0 */}
{(userId === restaurant.adminId && restaurant.totalRevenue !== undefined && restaurant.totalRevenue !== null) && (
  <div className="mt-3 pt-3 border-t border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">Total Revenue</p>
        <p className="text-lg font-bold text-green-600">
          {/* Ensure we pass a number to the formatter */}
          {formatCurrency(restaurant.totalRevenue || 0)}
        </p>
      </div>
      {(restaurant.totalOrders !== undefined && restaurant.totalOrders !== null) && (
        <div className="text-right">
          <p className="text-xs text-gray-500">Orders</p>
          <p className="text-lg font-semibold text-blue-600">
            {restaurant.totalOrders || 0}
          </p>
        </div>
      )}
    </div>
  </div>
)}
              </div>
              <div className="p-4 border-t text-center text-yellow-500 font-semibold">
                View Details
              </div>
            </div>
          ))}
      </div>

      {/* Recommendations Section */}
      <div className="mt-16">
        <RecommendationSection userId={userId} />
      </div>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes rgbGlow {
            0% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); }
            33% { box-shadow: 0 0 20px 4px rgba(0, 255, 0, 0.7); }
            66% { box-shadow: 0 0 25px 5px rgba(0, 0, 255, 0.7); }
            100% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); }
          }

          .animate-rgbGlow {
            animation: rgbGlow 2.8s infinite alternate ease-in-out;
            filter: brightness(1.15);
          }
        `}
      </style>
    </div>
  );
};

export default RestaurantMenu;