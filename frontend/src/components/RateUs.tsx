import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  averageRating?: number;
}

function RateUs() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // ✅ typed correctly
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then(res => res.json())
      .then(setRestaurants)
      .catch(err => console.error("Failed to fetch restaurants:", err));
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
          description,
          userId: localStorage.getItem("userId"),
        }),
      });

      alert("Rating submitted!");
      setSelectedId("");
      setRating(5);
      setDescription("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rate a Restaurant</h2>

      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
        <option value="">Select Restaurant</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} — {r.address}
          </option>
        ))}
      </select>

      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star
          </option>
        ))}
      </select>

      <textarea
        placeholder="Optional comment"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Submit Rating</button>
    </form>
  );
}

export default RateUs;
