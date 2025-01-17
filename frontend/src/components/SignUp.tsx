import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const backendUrl = import.meta.env.VITE_BACKEND_URL;



const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
      }),
    });

   

    if (!response.ok) {
        const data = await response.json();
      // Check if the error is "User already exists"
      if (data.error === "User already exists") {
        setError("User already exists");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        console.log("Error set to:", data.error);
      }
      return;
    }

    setSuccess("Account created successfully!");
    setFormData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Redirect to the login page after successful signup
    setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};


  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 font-bold text-center">Sign up</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-emerald-600 text-black hover:bg-green-dark focus:outline-none my-1"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
