"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch users from backend
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const url = search ? `/api/recipients?fullName=${encodeURIComponent(search)}` : "/api/recipients";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.recipients || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [search]);

  // Delete user
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/recipients?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
  }

  return (
    <section className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search by full name..."
          className="flex-1 px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-neutral-400 text-white font-semibold hover:bg-neutral-500 transition"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        )}
      </form>
      <Link
        href="/users/create"
        className="mb-4 inline-block px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Add User
      </Link>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto w-full max-w-3xl">
          <table className="min-w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Full Name</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-neutral-400">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <Link
                        href={`/users/update/${user._id}`}
                        className="px-3 py-1 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
} 