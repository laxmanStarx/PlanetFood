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
  const [loading, setLoading] = useState(false);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRestaurant = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/admin/restaurant`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurantId(response.data.id);
      } catch (err: any) {
        setError("Could not link to your restaurant. Please try again.");
      }
    };
    fetchRestaurant();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token || !restaurantId) {
      setError("Authentication error. Please login again.");
      setLoading(false);
      return;
    }

    const foodData = {
      name,
      description,
      price: parseFloat(price),
      image,
      restaurantId,
    };

    try {
      await axios.post(`${backendUrl}/api/v1/admin/menu`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Delicious! Your food item has been added.");
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Container */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Food Banner */}
        <div className="md:w-2/5 relative bg-orange-500">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
            alt="Delicious Food" 
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-3xl font-bold">New Creation?</h1>
            <p className="text-sm opacity-90 mt-2">Add your latest culinary masterpiece to the menu and delight your customers.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          <header className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800">Add Food Item</h2>
            <p className="text-gray-500 text-sm">Fill in the details below to update your menu.</p>
          </header>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dish Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Truffle Mushroom Pasta"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://image-link.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the flavors, ingredients, and soul of the dish..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all duration-300 transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Adding to Menu..." : "Publish Food Item"}
            </button>
          </form>
        </div>
      </div>
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




