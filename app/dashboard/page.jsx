"use client";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const USERS_PER_PAGE = 10;

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const url = search ? `/api/recipients?fullName=${encodeURIComponent(search)}` : '/api/recipients';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.recipients || []);
        setPage(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [search]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div className="text-red-500">Please sign in to access the dashboard.</div>;

  // Pagination logic
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-2 w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by full name..."
              className="flex-1 px-4 py-2 rounded border border-neutral-300 focus:outline-none"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <Button type="submit" className="px-4 py-2">Search</Button>
            {search && (
              <Button type="button" variant="secondary" className="px-4 py-2" onClick={handleClearSearch}>Clear</Button>
            )}
          </form>
          {role === "volunteer" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Volunteer Features</h2>
              <ul className="list-disc list-inside text-left text-base">
                <li>View Assigned Users</li>
                <li>Update Food History</li>
                <li>View Limited Reports</li>
              </ul>
            </div>
          )}
          {role !== "admin" && role !== "volunteer" && (
            <div className="text-neutral-500">No role assigned. Please contact an administrator.</div>
          )}
          {/* Users table, no heading */}
          {loading && <div>Loading users...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[600px] w-full table-fixed border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'33%'}}>Full Name</th>
                    <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'17%'}}>Age</th>
                    <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'50%'}}>Email Address</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">No users found.</td>
                    </tr>
                  ) : (
                    paginatedUsers.map(user => {
                      // Calculate age from dateOfBirth
                      let age = '';
                      if (user.dateOfBirth) {
                        const dob = new Date(user.dateOfBirth);
                        const diff = Date.now() - dob.getTime();
                        const ageDate = new Date(diff);
                        age = Math.abs(ageDate.getUTCFullYear() - 1970);
                      }
                      return (
                        <tr key={user._id} className="border-b last:border-b-0">
                          <td className="px-4 py-2 text-center">{user.fullName}</td>
                          <td className="px-4 py-2 text-center">{age}</td>
                          <td className="px-4 py-2 text-center">{user.emailAddress}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="self-center">Page {page} of {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 