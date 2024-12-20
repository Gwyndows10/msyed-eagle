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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">{formatField(user.fullName)}</h2>
              <p>Email: {formatField(user.emailAddress)}</p>
              <p>Phone: {formatField(user.contactPhone)}</p>
              <p>Took Food: {displayBoolean(user.tookFood)}</p>
              <button
                  onClick={() => toggleTookFood(user._id, user.tookFood)}
                  className={`px-4 py-2 rounded ${user.tookFood ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {user.tookFood ? "Undo Took Food" : "Mark as Took Food"}
                </button>
            </div>
            
          ))}
          
        </div>

      )}
      
    </main>
  </div>
);

  return (
    <LockVolunteer showUI={ui} />
  )
}
