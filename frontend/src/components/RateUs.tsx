import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Only toast, not ToastContainer
import 'react-toastify/dist/ReactToastify.css';

interface RateUsProps {
  onClose?: () => void;
}

const RateUs: React.FC<RateUsProps> = ({ onClose }) => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("http://localhost:8080/restaurants");
      const data = await res.json();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8080/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedId,
          rating,
          userId: localStorage.getItem("userId"),
        }),
      });

      toast.success("Rating submitted!");
      setSelectedId("");
      setRating(5);

      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Rate a Restaurant</h2>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        required
        className="w-full border px-2 py-1 mb-4"
      >
        <option value="">Select a restaurant</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border px-2 py-1 mb-4"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default RateUs;
