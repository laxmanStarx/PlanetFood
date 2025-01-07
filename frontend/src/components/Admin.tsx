import React, { useState } from "react";

const PromoteToAdmin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const promoteUser = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token
      if (!token) {
        setError("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("http://localhost:8080/isAdmin/assign-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: JSON.stringify({ email }), // Pass email of user to promote
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Failed to promote user.");
        return;
      }

      const data = await response.json();
      setMessage(data.message || "User promoted to admin successfully.");
      setEmail(""); // Clear the input field
    } catch (error) {
      console.error(error);
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
