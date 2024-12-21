"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarVolunteer from "../../components/SideBarVolunteer"
import LockVolunteer from "@/components/lockVolunteer";
import SearchForm from "@/components/SearchForm";

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
  const toggleTookFood = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/recipients/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tookFood: !currentStatus }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, tookFood: !currentStatus } : user
          )
        );
      } else console.error("Failed to update tookFood status");
    } catch (err) {
      console.error(err);
    }
  };
  const displayBoolean = (value) => (value ? "Yes" : "No");

const ui = (
  <div className="flex h-screen bg-gray-900 text-white">
    <SidebarVolunteer />
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold mb-6">Recipient List</h1>

      <SearchForm
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
        />
  
      {/* Recipient List */}
      {loading ? (
  <div>Loading...</div>
) : error ? (
  <div>Error: {error}</div>
) : (
  <table className="min-w-full bg-gray-800 rounded-lg">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left">Full Name</th>
        <th className="px-4 py-2 text-left">Email</th>
        <th className="px-4 py-2 text-left">Phone</th>
        <th className="px-4 py-2 text-left">Took Food</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr
          key={user._id}
          className="hover:bg-gray-700 cursor-pointer"  // Add row click functionality
        >
          <td className="px-4 py-2">{user.fullName ?? "N/A"}</td>
          <td className="px-4 py-2">{user.emailAddress ?? "N/A"}</td>
          <td className="px-4 py-2">{user.contactPhone ?? "N/A"}</td>
          <td className="px-4 py-2">
            <button
              onClick={(e) => {
                toggleTookFood(user._id, user.tookFood);
              }}
              className={`px-4 py-2 rounded ${user.tookFood ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {user.tookFood ? "Undo Took Food" : "Mark as Took Food"}
            </button>
          </td>
          
        </tr>
      ))}
    </tbody>
  </table>
)}
      
    </main>
  </div>
);

  return (
    <LockVolunteer showUI={ui} />
  )
}
