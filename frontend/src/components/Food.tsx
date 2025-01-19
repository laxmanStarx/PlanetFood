import React, { useState } from "react";
import axios from "axios";





const AddFoodForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const foodData = {
      name,
      description,
      price: parseFloat(price),
      image,
      restaurantId,
    };

    try {
      await axios.post(`${backendUrl}/api/v1/admin/menu`, foodData); // Adjust the endpoint as needed
      setSuccess("Food item added successfully!");
      setError("");
      // Clear form fields
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setRestaurantId("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add food item.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Add Food Item</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Restaurant ID:</label>
          <input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default AddFoodForm;















