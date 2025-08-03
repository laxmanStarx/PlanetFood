import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantForm: React.FC = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    image: "",
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); // Or from your auth context

  if (!token) {
    alert("Please log in as admin to add a restaurant.");
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token for auth
      },
      body: JSON.stringify(restaurant),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add restaurant");
    }

    alert("Restaurant added successfully!");
    setRestaurant({ name: "", address: "", image: "" });
  } catch (error: any) {
    console.error("Error adding restaurant:", error);
    alert(error.message || "Failed to add restaurant.");
  }
};

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center my-4">Add Restaurant</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={restaurant.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={restaurant.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={restaurant.image}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Restaurant
        </button>
      </form>
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/add-menu")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Go to Food Form
        </button>
      </div>
    </div>
  );
};

export default RestaurantForm;
