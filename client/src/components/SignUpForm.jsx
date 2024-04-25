import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false); 
  const { signUp, loading, login } = useUserContext(); 

  const handleSignUp = () => {
    if (name && email) {
      signUp({ name, email })
        .then(() => {
          toast.success("Sign up successful!", {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setSignedUp(true); 
          setName("");
          setEmail("");
        })
        .catch((error) => {
          toast.error("Sign up failed. Please try again later.");
          console.error("Error signing up:", error);
        });
    } else {    
      toast.error("Please fill in both name and email fields.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className={`text-center font-bold my-4`}>Sign Up</h2>
      <label htmlFor="name" className="mb-2">
        Name:
        <input
          className="border border-gray-400 rounded-md px-2 py-1 ml-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label htmlFor="email" className="mb-2">
        Email:
        <input
          className="border border-gray-400 rounded-md px-2 py-1 ml-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      {signedUp ? (
        <button
          className={`bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
          onClick={login}
        >
          Log In
        </button>
      ) : (
        <button
          className={`bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <FaSpinner className={`animate-spin`} /> : "Sign Up"}
        </button>
      )}
    </div>
  );
}
