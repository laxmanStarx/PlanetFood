import React, { useState } from "react";


const PromoteToAdmin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const promoteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/isAdmin/assign-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Existing token
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log("Server response:", data); // Debug the response
  
      if (!response.ok) {
        setError(data.error || "Failed to promote user.");
        return;
      }
  
      setMessage(data.message || "User promoted to admin successfully.");
      if (data.token) {
        localStorage.setItem("token", data.token); // Save the new token
        console.log("New token:", data.token);
      } else {
        console.error("Token missing in response.");
      }
      setEmail(""); // Clear the input field
    } catch (error) {
      console.error("Error in promoteUser:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Promote User to Admin</h2>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <button onClick={promoteUser} className="btn">
        Promote to Admin
      </button>
    </div>
  );
};

export default PromoteToAdmin;
