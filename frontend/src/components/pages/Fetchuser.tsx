import React, { useState } from "react";
const backendUrl = process.env.REACT_APP_BACKEND_URL

const CheckUserRole: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");
 

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token
      if (!token) {
        setError("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch(`${backendUrl}user/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Failed to fetch user role.");
        return;
      }

      const data = await response.json();
      setRole(data.role);
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Check User Role</h2>
      {error && <p className="text-red-500">{error}</p>}
      {role && <p className="text-green-500">Role: {role}</p>}
      <button onClick={fetchUserRole} className="btn">
        Fetch Role
      </button>
    </div>
  );
};

export default CheckUserRole;
