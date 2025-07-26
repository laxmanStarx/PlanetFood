
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {

  const navigate = useNavigate();
 



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">

        <button
          onClick={() => navigate('/SubmitRating')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Thankyou For Purchasing
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;