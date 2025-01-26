import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await fetch(`${backendUrl}/restaurants`);
  //       const data = await response.json();
  //       setRestaurants(data);
  //     } catch (error) {
  //       console.error("Error fetching restaurants:", error);
  //     }
  //   };
  //   fetchRestaurants();
  // }, []);




  useEffect(() => {
    const fetchRestaurantsWithRatings = async () => {
      try {
        const response = await fetch(`${backendUrl}/restaurants`);
        const restaurants = await response.json();

        const restaurantsWithRatings = await Promise.all(
          restaurants.map(async (restaurant: Restaurant) => {
            const ratingResponse = await fetch(
              `${backendUrl}/restaurants/${restaurant.id}/ratings`
            );
            const { averageRating } = await ratingResponse.json();
            return { ...restaurant, averageRating };
          })
        );

        setRestaurants(restaurantsWithRatings);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurantsWithRatings();
  }, []);














  return (
    <div className=" justify-between items-center container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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


              {restaurant.averageRating !== undefined ? (
                <p className="text-yellow-500 font-bold mt-2">
                  <img  src ="./stars.png" className=" w-5 h-5"/>{restaurant.averageRating.toFixed(1)}  
                </p>
              ) : (
                <p className="text-gray-500 mt-2">No ratings yet</p>
              )}











            </div>
            <div className="p-4 border-t text-center text-blue-500 font-semibold">
              View Details
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
