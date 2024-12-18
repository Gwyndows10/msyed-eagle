"use client";

import Image from "next/image";
import localFont from "next/font/local";
//import dotenv from '../../dotenv';
//dotenv.config();
import { useState } from "react"; // For managing email and password state
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseSetup";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password

  const login = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

     
     
     

      if (error) {
        alert(`Login failed: ${error.message}`);
      } else {
        alert("Login successful!");
        const {
          data: { user },
        } = await supabase.auth.getUser()
        let metadata = user?.user_metadata
        let role = metadata.role

        console.log(role)
        if (role == "admin"){
          router.push("/admin");
        }
        else if (role == "volunteer"){
          router.push("/volunteer")
        }
        // Redirect to admin page after successful login
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  };

  return (
    <div
      className={` flex items-center justify-center min-h-screen bg-gray-100 p-6`}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-geist-sans)] text-black">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm font-[family-name:var(--font-geist-mono)]">
            Please log in to continue.
          </p>
        </div>
        <form className="space-y-4" onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition "
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
