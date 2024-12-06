"use client";

import { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/recipients/[id]"); // Adjust the endpoint to match your backend route
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.recipients); // Assuming the API returns a `recipients` array
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
      <aside className="w-64 bg-gray-800 p-5">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl font-semibold">
              U
            </div>
            <div>
              <h2 className="text-lg font-medium">Musab</h2>
              <p className="text-gray-400 text-sm">musab@gmail.com</p>
            </div>
          </div>
        </div>
        <nav className="space-y-4">
          <a href="#" className="block p-2 text-lg bg-gray-700 rounded-md">
            Dashboard
          </a>
          <a href="users" className="block p-2 text-lg text-gray-300 hover:bg-gray-700 rounded-md">
            Users
          </a>
        </nav>
      </aside>

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
