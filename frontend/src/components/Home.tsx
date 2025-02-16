
import { useNavigate } from "react-router-dom";
import RestaurantMenu from "./RestaurantMenu"
import { useEffect, useState } from "react";


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
    <div className="container justify-center items-center  mx-auto mt-8">
     






       <div className="flex justify-center items-center  rounded-3xl">
      {isAdmin && (
        <button
          onClick={() => navigate("/add-menu")}
          className="mt-4 px-4 py-2 bg-red-500 text-white  rounded-full  hover:bg-blue-700  items-center text-center justify-center  "
        >
          Go to Add Menu Form
        </button>
      )}
      </div>

      <div className="flex justify-center items-center py-5 space-x-5">
  <img
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg"
    className="h-32 w-32 rounded-full object-cover "
    alt="issue occurred"
  />



<img
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1737970792/dine_rhkgsf.jpg"
    className="h-32 w-32 rounded-full object-cover  "
    alt="issue occurred"
  />

<img
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1737802470/rasgulla_uoquhz.jpg"
    className="h-32 w-32 rounded-full object-cover  "
    alt="issue occurred"
  />

<img
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1737970792/dine_rhkgsf.jpg"
    className="h-32 w-32 rounded-full object-cover  "
    alt="issue occurred"
  />

<img
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1737276274/food-images/roti.jpg"
    className="h-32 w-32 rounded-full object-cover  "
    alt="issue occurred"
  />




</div>

      
    </div>





<RestaurantMenu />


    </>
  )
}

export default Home