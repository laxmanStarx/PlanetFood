import { useEffect, useState } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface RecommendationItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
}

interface RecommendationsProps {
  userId: string | null;
}

const Recommendations: React.FC<RecommendationsProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/recommendations/${userId}`);
        const data = await res.json();
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  if (loading) return <p className="text-center text-gray-500">Loading recommendations...</p>;

  if (!recommendations.length) {
    return <p className="text-center text-gray-400">No recommendations found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-2xl p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-2 text-md font-bold text-green-600">${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
