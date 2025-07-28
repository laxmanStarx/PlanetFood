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
        
          userId: localStorage.getItem("userId"),
        }),
      });

      alert("Rating submitted!");
      setSelectedId("");
      setRating(5);
     
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <>

    <div className="min-h-screen top-0 bg-[url('https://res.cloudinary.com/dykahal7o/image/upload/v1753734783/Screenshot_2025-07-29_020248_v7rdjc.png')] bg-cover max-w-[full]   bg-no-repeat my-10  rounded-2xl  max-h-[full] mx-auto p-4 flex flex-col items-center justify-center text-center py-10 ">
  {/* Your entire app or page content here */}

     {/* <div className=" bg-orange-400 my-10 max-h-full rounded-2xl max-w-[500px]  mx-auto p-4 flex flex-col items-center justify-center text-center py-10 "> */}
     
    <form onSubmit={handleSubmit}>
      <div className="flex font-bold text-4xl cursor-pointer justify-center text-center ">
      <h2 >Rate a Restaurant</h2>
      </div>

      <div className="flex text-center justify-center items-center cursor-pointer rounded-sm py-2">

      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
        <option value="">Select Restaurant</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} — {r.address}
          </option>
        ))}
      </select>
      </div>

      <div className="items-center justify-center flex py-5 mx-auto cursor-pointer w-10">
     

      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star
          </option>
        ))}
      </select>
      </div>

      <div className="flex bg-green-800 hover:bg-cyan-700 cursor-pointer text-center justify-center items-center rounded-md">



      <button type="submit" className=" text-center items-center justify-center">Submit Rating</button>
      </div>
    </form>
    </div>
    {/* </div> */}
   
     </>
  );
}

export default RateUs;
