// import { useNavigate } from "react-router-dom"; // Correct hook for navigation
// import { PrimaryButton } from "./buttons/PrimaryButton"
// import { SecondaryButton } from "./buttons/SecondaryButton";




// const Navbar = () => {
//     const navigate = useNavigate();


//     const handleLogout = () => {
//         // Remove token and any other stored user data
//         localStorage.removeItem("token");
//         localStorage.removeItem("role"); // If role is stored
//         localStorage.removeItem("user"); // If user details are stored
    
//         // Redirect to the login page
//         navigate("/login");
//       };





//   return (
//     <>




   
//  <nav className="flex items-center justify-between  bg-orange-400 min-h-16 cursor-pointer border-b px-4">
//         {/* Logo Section */}
//          <div className="flex items-center text-3xl">
            
//            <button onClick={()=>
//             navigate("/")
//           }>laxmanStarX</button>
//         </div> 

   

//         {/* Button Section  */}
//          <div className="flex items-center space-x-4">
//         <span>About Us</span>
//         <span>Cart</span>
//           <PrimaryButton
//             onClick={() => {
//              navigate("/login")
//             }}
//           >
//             SignIn
//           </PrimaryButton>

//           <SecondaryButton onClick={handleLogout}>
//             LogOut
//           </SecondaryButton>
         
//         </div>
//       </nav>











//     </>


//   )
// }

// export default Navbar








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and token
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-orange-400 min-h-16 px-4">
      <div className="text-3xl">
        <button onClick={() => navigate("/")}>laxmanStarX</button>
      </div>
      <div className="flex items-center space-x-4">
        <span>About Us</span>
        <span>Cart</span>
        {userName ? (
          <>
            <span> {userName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;










    
