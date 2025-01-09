
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
      <h1 className="text-3xl font-bold text-center">Welcome to the Homepage</h1>
      {isAdmin && (
        <button
          onClick={() => navigate("/add-menu")}
          className="mt-4 px-4 py-2 bg-red-500 text-white  rounded-full  hover:bg-blue-700  items-center justify-between  "
        >
          Go to Add Menu Form
        </button>
      )}
    </div>





<RestaurantMenu />


    </>
  )
}

export default Home