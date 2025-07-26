import { useState } from "react";
import axios from "axios";

type Props = {
  userId: string;
  restaurantId: string;
};

export default function SubmitRating({ userId, restaurantId }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/ratings", {
        userId,
        restaurantId,
        rating,
        description,
      });
      alert("Rating submitted!");
    } catch (err) {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div>
      <h2>Submit Rating</h2>
      <label>Rating (1-5):</label>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min={1}
        max={5}
      />
      <br />
      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
