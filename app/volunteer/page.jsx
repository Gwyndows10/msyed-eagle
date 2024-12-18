"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function Volunteer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    fullName: "",
    ID: "",
    emailAddress: "",
    contactPhone: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = "?";
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) query += `${key}=${searchParams[key]}&`;
    });
    setSearchQuery(query.slice(0, -1));
  };

  const formatField = (field) => field ?? "N/A";

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Recipient List</h1>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={searchParams.fullName}
            onChange={handleSearchChange}
            className="p-2 bg-gray-800 text-white rounded"
          />
          <input
            type="text"
            name="ID"
            placeholder="ID"
            value={searchParams.ID}
            onChange={handleSearchChange}
            className="p-2 bg-gray-800 text-white rounded"
          />
          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={searchParams.emailAddress}
            onChange={handleSearchChange}
            className="p-2 bg-gray-800 text-white rounded"
          />
          <input
            type="text"
            name="contactPhone"
            placeholder="Phone"
            value={searchParams.contactPhone}
            onChange={handleSearchChange}
            className="p-2 bg-gray-800 text-white rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Recipient List */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user._id} className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">{formatField(user.fullName)}</h2>
                <p>ID: {formatField(user.ID)}</p>
                <p>Email: {formatField(user.emailAddress)}</p>
                <p>Phone: {formatField(user.contactPhone)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}