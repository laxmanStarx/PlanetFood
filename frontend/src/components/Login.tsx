import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";




const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token); // Save JWT token
      localStorage.setItem("user", JSON.stringify(data.user)); // Save user details
      localStorage.setItem("userId", data.user.id); // Save userId
  
      setSuccess("Login successful!");
  
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 font-bold text-center">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-green text-black hover:bg-green-dark focus:outline-none my-1"
            >
              Login
            </button>
          </form>
          <span className="text-center items-center justify-center">Don't have account  <Link to="/signup">SignUp here:</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contextApi/AuthContext";

// const LoginPage = () => {
//   const [userIdInput, setUserIdInput] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (userIdInput.trim()) {
//       login(userIdInput); // Store userId in AuthContext
//       navigate("/"); // Redirect to checkout after login
//     } else {
//       alert("Please enter a valid User ID");
//     }
//   };

//   return (
//     <div>
//       <h2>Login Page</h2>
//       <input
//         type="text"
//         placeholder="Enter User ID"
//         value={userIdInput}
//         onChange={(e) => setUserIdInput(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default LoginPage;















