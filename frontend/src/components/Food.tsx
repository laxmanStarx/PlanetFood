import React, { useEffect, useState } from "react";
import axios from "axios";





const AddFoodForm: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRestaurant = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/admin/restaurant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurantId(response.data.id); // ✅ Set the restaurantId automatically
      } catch (err: any) {
        console.error("Failed to fetch restaurant for admin", err);
        setError("Could not fetch your restaurant.");
      }
    };

    fetchRestaurant();
  }, []);

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token || !restaurantId) return;

  const foodData = {
    name,
    description,
    price: parseFloat(price),
    image,
    restaurantId, // ✅ automatically attached
  };

  try {
    await axios.post(`${backendUrl}/api/v1/admin/menu`, foodData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setSuccess("Food item added successfully!");
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
  } catch (err: any) {
    setError(err.response?.data?.error || "Failed to add food item.");
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
        {/* <div>
          <label>Restaurant ID:</label>
          <input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            required
          />
        </div> */}
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default AddFoodForm;











// import React, { useState } from "react";
// import axios from "axios";

// const AddFoodForm: React.FC = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [restaurantId, setRestaurantId] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("description", description);
//     formData.append("price", price);
//     if (imageFile) {
//       formData.append("image", imageFile); // File upload
//     }
//     formData.append("restaurantId", restaurantId);









//     try {
//       await axios.post(`${backendUrl}/api/v1/admin/menu`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setSuccess("Food item added successfully!");
//       setError("");
//       // Clear form fields
//       setName("");
//       setDescription("");
//       setPrice("");
//       setImageFile(null);
//       setRestaurantId("");
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to add food item.");
//       setSuccess("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">Add Food Item</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Description:</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-lg p-2"
//             ></textarea>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Price:</label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Image:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files?.[0] || null)}
//               required
//               className="w-full border border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Restaurant ID:</label>
//             <input
//               type="text"
//               value={restaurantId}
//               onChange={(e) => setRestaurantId(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
//           >
//             Add Food
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddFoodForm;




