import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${backendUrl}/api/v1/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id);

      setSuccess("Welcome back! Entering the kitchen...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Connection failed. Please check your internet.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf7] p-4 lg:p-0">
      {/* Main Card Container */}
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Side: Floral Food Banner */}
        <div className="lg:w-1/2 relative hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000" 
            alt="Healthy Food" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Floral/Nature Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-emerald-900/40 flex flex-col justify-center items-center text-center p-12 backdrop-blur-[2px]">
            <div className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
               {/* Decorative Flower Icon SVG */}
               <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Zm0-18a8,8,0,1,0,8,8A8,8,0,0,0,12,4Z opacity-0.3"/>
                 <path d="M12,7a5,5,0,0,1,5,5,5,5,0,0,1-5,5,5,5,0,0,1-5-5A5,5,0,0,1,12,7Z"/>
                 <path d="M12,2c1,3,4,3,4,6s-3,4-4,7c-1-3-4-4-4-7S11,5,12,2Z"/>
                 <path d="M22,12c-3,1-3,4-6,4s-4-3-7-4c3-1,4-4,7-4S19,11,22,12Z"/>
               </svg>
            </div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4 italic">Fresh & Floral</h2>
            <p className="text-white/90 text-lg font-light leading-relaxed">
              Experience the art of fine dining, where every ingredient is picked with love.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
          {/* Subtle Flower Pattern Background (CSS only) */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <svg className="w-32 h-32 text-orange-600" fill="currentColor" viewBox="0 0 100 100">
               <path d="M50 0 C60 30 90 40 90 50 C90 60 60 70 50 100 C40 70 10 60 10 50 C10 40 40 30 50 0" />
             </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-8">Sign in to continue your culinary journey</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm rounded-2xl border border-emerald-100 flex items-center">
                <span className="mr-2">✨</span> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-600 font-bold hover:underline">
                Create one here
              </Link>
            </div>
          </div>
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















