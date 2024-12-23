"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Lock from "@/components/lock";
import SearchForm from "@/components/SearchForm";  // Assuming you have a search form component

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetMessage, setResetMessage] = useState(""); 
  const [isResetting, setIsResetting] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/recipients${searchQuery}`);
        const data = await response.json();
        setUsers(data.recipients || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  // Handle button click to navigate to a report
  const handleRedirect = (url) => {
    router.push(url); // Next.js useRouter for navigation
  };

  const ui = (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Which Report would you like?
        </h1>

        {/* Report Buttons Section */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleRedirect('/reports/ethnicities')}
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Ethnicities
          </button>
          <button
            onClick={() => handleRedirect('/reports/foodQuantity')}
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Report 2
          </button>
          <button
            onClick={() => handleRedirect('/reports/report3')}
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Report 3
          </button>
          <button
            onClick={() => handleRedirect('/reports/report4')}
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Report 4
          </button>
          <button
            onClick={() => handleRedirect('/reports/report5')}
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Report 5
          </button>
        </div>

        {/* Optionally display loading/error messages */}
        {loading && <p>Loading users...</p>}
        {error && <p>Error: {error}</p>}

      </main>
    </div>
  );

  return (
    <Lock showUI={ui} />
  );
}
