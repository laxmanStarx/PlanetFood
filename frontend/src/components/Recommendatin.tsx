import { useEffect, useState } from "react";

const RecommendationSection = ({ userId }: { userId: string }) => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations?userId=${userId}`);
          const data = await res.json();
  
          if (Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations);
          }
        } catch (err) {
          console.error("Error fetching recommendations:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRecommendations();
    }, [userId]);
  
    if (loading) return <p className="text-center text-gray-500 mt-4">Loading recommendations...</p>;
  
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Recommended for You</h2>
        {recommendations.length === 0 ? (
          <p className="text-center text-gray-500">No recommendations available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow hover:shadow-xl"
              >
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="mt-3 text-blue-500 font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  

export default RecommendationSection;