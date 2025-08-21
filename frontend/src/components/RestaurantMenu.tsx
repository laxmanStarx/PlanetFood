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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "./Recommendatin";



interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string;
  averageRating?: number;
}




const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RestaurantMenu = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
 

  // const [recommendations, setRecommendations] = useState<string[]>([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');  // You can dynamically pass this value as needed

  useEffect(() => {
    // Fetch restaurants
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

          {restaurant.averageRating !== undefined && (
            <p className=" text-red-900 text-md mt-1">
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


            </p>
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
        {/* <h2 className="text-2xl font-bold text-center mb-6">Recommended for You</h2> */}

        {/* <RecommendationSection userId="cm5l4omqb0wgyf7wehd" /> */}
        <RecommendationSection  userId={userId} /> 


        
      </div>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes rgbGlow {
            0% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Moderate Red */
            33% { box-shadow: 0 0 20px 4px rgba(0, 255, 0, 0.7); } /* Moderate Green */
            66% { box-shadow: 0 0 25px 5px rgba(0, 0, 255, 0.7); } /* Moderate Blue */
            100% { box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7); } /* Back to Red */
          }

          .animate-rgbGlow {
            animation: rgbGlow 2.8s infinite alternate ease-in-out;
            filter: brightness(1.15); /* Slightly boosted brightness */
          }
        `}
      </style>
    </div>
  );
};

export default RestaurantMenu;


// cm5l4omqb0000tt5wgyf7wehd
// cm5l4omqb0000tt5wgyf7wehd