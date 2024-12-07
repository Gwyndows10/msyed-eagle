"use client";

import { fetchRecipients } from "@/utils/fetchHelpers";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
export default function Admin() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const recipients = await fetchRecipients();
        setUsers(recipients); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">User List</h1>
        <div className="grid grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-2">{user.fullName}</h2>
              <p className="text-gray-400">ID: {user.ID}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
