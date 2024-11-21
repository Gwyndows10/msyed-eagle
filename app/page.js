"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useRouter } from 'next/navigation'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


const login = (event) => {
  event.preventDefault(); // Prevent form submission
  const router = useRouter();
  router.push("admin"); // Navigate to /admin
};
export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex items-center justify-center min-h-screen bg-gray-100 p-6`}
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
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={(event) => login(event)}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
