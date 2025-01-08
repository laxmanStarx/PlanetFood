import React, { useState } from "react";


const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      console.log("User details:", data.user); // Display user details in the console
      localStorage.setItem("token", data.token); // Save token for future requests
      setUserDetails(data.user);
      
      setError("");
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn" onClick={()=>{
          
        }}>
          Login
        </button>
      </form>

      {userDetails && (
        <div>
          <h3>Welcome, {userDetails.name}</h3>
          <p>Role: {userDetails.role}</p>
          <p>Email: {userDetails.email}</p>

        </div>
      )}
    </div>
  );
};

export default AdminLogin;
