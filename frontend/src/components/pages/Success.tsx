// SuccessPage.tsx
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
    </div>
  );
};

export default SuccessPage;
