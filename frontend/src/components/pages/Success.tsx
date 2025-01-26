

import React from "react";








const SuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-3xl font-bold text-green-500 mt-10">
        Payment Successful!
      </h1>
      <p className="text-gray-700 mt-4">Thank you for your purchase.</p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Home
      </a>
      <h1> FeedBack Form</h1>

    </div>
  );
};

export default SuccessPage;

































// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// const SuccessPage: React.FC = () => {
//   const [message, setMessage] = useState("Saving your order...");
//   const [searchParams] = useSearchParams();

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const saveOrder = async () => {
//       const sessionId = searchParams.get("session_id");

//       if (!sessionId) {
//         setMessage("Session ID missing. Could not verify payment.");
//         return;
//       }

//       try {
//         const response = await fetch(`${backendUrl}/save-order`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sessionId }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to save order");
//         }

//         setMessage("Order saved successfully! Thank you for your purchase.");
//       } catch (error) {
//         console.error("Error saving order:", error);
//         setMessage("Error saving order. Please contact support.");
//       }
//     };

//     saveOrder();
//   }, []);

//   return (
//     <div className="container mx-auto text-center">
//       <h1 className="text-3xl font-bold text-green-500 mt-10">
//         Payment Successful!
//       </h1>
//       <p className="text-gray-700 mt-4">{message}</p>
//       <a
//         href="/"
//         className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Go to Home
//       </a>
//     </div>
//   );
// };

// export default SuccessPage;



