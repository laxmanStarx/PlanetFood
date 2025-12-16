import { useNavigate } from "react-router-dom";
import RestaurantMenu from "./RestaurantMenu"
import { useEffect, useState } from "react";

import Hero from "./pages/Hero";



const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      // Check if the user's role is admin
      setIsAdmin(parsedUser.role === "admin");
    }
  }, []);

  return (
    <>
      {/* Header Navigation */}
    <main>
      <Hero />
     

                {/* <div className="flex justify-center items-center mb-8">
           {isAdmin && (
               <button
                 onClick={() => navigate("/add-menu")}
               className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-blue-700 transition-colors"
               >
                Go to Add Menu Form
               </button>
            )}
           </div> */}

      {/* Stats Section */}
      {/* <section className="relative bg-black">
        <img
          src="https://res.cloudinary.com/dykahal7o/image/upload/v1753452625/112315676_y1myor.jpg"
          alt="Background Croissants"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center space-y-6">
          <p className="max-w-md">
            Experience the finest croissants, crafted with fresh ingredients for a delightful taste.
          </p>
          <div className="flex gap-8">
            <div><strong className="text-2xl">300+</strong><br />Food items</div>
            <div><strong className="text-2xl">50+</strong><br />Restaurants</div>
            <div><strong className="text-2xl">15k+</strong><br />Happy customers</div>
          </div>
        </div>
      </section> */}
     
    </main>

    {/* <Foodypaste /> */}


    <RestaurantMenu />
    
                    <div className="flex justify-center items-center mb-8">
           {isAdmin && (
               <button
                 onClick={() => navigate("/restaurant-form")}
               className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-blue-700 transition-colors"
               >
                Go to Restaurant Form
               </button>
            )}
           </div>


    </>
  )
}

export default Home




















          // <div className="flex justify-center items-center mb-8">
          //   {isAdmin && (
          //     <button
          //       onClick={() => navigate("/add-menu")}
          //       className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-blue-700 transition-colors"
          //     >
          //       Go to Add Menu Form
          //     </button>
          //   )}
          // </div>