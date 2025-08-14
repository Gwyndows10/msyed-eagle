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
  const [checkedInUsers, setCheckedInUsers] = useState(new Set());
  const [checkInLog, setCheckInLog] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logPage, setLogPage] = useState(1);

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

  useEffect(() => {
    async function fetchCheckInLogs() {
      setLoadingLogs(true);
      try {
        const res = await fetch('/api/check-in-log?limit=20');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setCheckInLog(data.logs || []);
      } catch (err) {
        console.error('Failed to fetch check-in logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchCheckInLogs();
  }, []);

  useEffect(() => {
    async function fetchCheckInStatus() {
      try {
        const res = await fetch('/api/check-in-status');
        if (res.ok) {
          const data = await res.json();
          const checkedInSet = new Set();
          Object.entries(data.statusMap).forEach(([userId, isCheckedIn]) => {
            if (isCheckedIn) {
              checkedInSet.add(userId);
            }
          });
          setCheckedInUsers(checkedInSet);
        }
      } catch (err) {
        console.error('Failed to fetch check-in status:', err);
      }
    }
    fetchCheckInStatus();
  }, []);



  if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div className="text-red-500">Please sign in to access the dashboard.</div>;

  // Pagination logic
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);
  
  // Check-in log pagination logic
  const LOGS_PER_PAGE = 7;
  const totalLogPages = Math.ceil(checkInLog.length / LOGS_PER_PAGE);
  const paginatedLogs = checkInLog.slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
  }

  async function handleCheckIn(userId) {
    try {
      const action = checkedInUsers.has(userId) ? 'checked out' : 'checked in';
      const userName = users.find(u => u._id === userId)?.fullName;
      
      // Log to database
      console.log('Sending check-in log:', { userId, userName, action, timestamp: new Date().toISOString() });
      const res = await fetch('/api/check-in-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: userName, // Include the user's full name
          action,
          timestamp: new Date().toISOString(),
          checkedInBy: user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Unknown'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to log check-in');
      }

      // Refresh logs
      const logsRes = await fetch('/api/check-in-log?limit=20');
      if (logsRes.ok) {
        const data = await logsRes.json();
        setCheckInLog(data.logs || []);
      }

      // Refresh check-in status from database
      const statusRes = await fetch('/api/check-in-status');
      if (statusRes.ok) {
        const data = await statusRes.json();
        const checkedInSet = new Set();
        Object.entries(data.statusMap).forEach(([uid, isCheckedIn]) => {
          if (isCheckedIn) {
            checkedInSet.add(uid);
          }
        });
        setCheckedInUsers(checkedInSet);
      }
    } catch (error) {
      console.error('Failed to log check-in:', error);
      // If logging fails, refresh the status to ensure UI is in sync
      try {
        const statusRes = await fetch('/api/check-in-status');
        if (statusRes.ok) {
          const data = await statusRes.json();
          const checkedInSet = new Set();
          Object.entries(data.statusMap).forEach(([uid, isCheckedIn]) => {
            if (isCheckedIn) {
              checkedInSet.add(uid);
            }
          });
          setCheckedInUsers(checkedInSet);
        }
      } catch (refreshError) {
        console.error('Failed to refresh status after error:', refreshError);
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-7xl shadow-lg">
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
                    {/* Two-column layout: Users table on left, Check-in log on right */}
          <div className="flex gap-6">
            {/* Left column: Users table */}
            <div className="flex-1 flex flex-col">
              {loading && <div>Loading users...</div>}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error && (
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-3 text-center">User List</h3>
                  <div className="h-96 overflow-y-auto overflow-x-hidden">
                    <table className="w-full table-fixed border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded shadow">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'18%'}}>Full Name</th>
                          <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'8%'}}>Age</th>
                          <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'54%'}}>Email Address</th>
                          <th className="px-4 py-2 border-b text-center bg-neutral-100 font-semibold" style={{width:'20%'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">No users found.</td>
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
                                <td className="px-4 py-2 text-center">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleCheckIn(user._id)}
                                    className={checkedInUsers.has(user._id) 
                                      ? "bg-red-600 hover:bg-red-700" 
                                      : "bg-green-600 hover:bg-green-700"
                                    }
                                  >
                                    {checkedInUsers.has(user._id) ? "Checked In" : "Check In"}
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPage(page - 1);
                          // Reset scroll to top
                          const tableContainer = document.querySelector('.overflow-y-auto');
                          if (tableContainer) {
                            tableContainer.scrollTop = 0;
                          }
                        }}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="self-center">Page {page} of {totalPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPage(page + 1);
                          // Reset scroll to top
                          const tableContainer = document.querySelector('.overflow-y-auto');
                          if (tableContainer) {
                            tableContainer.scrollTop = 0;
                          }
                        }}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right column: Check-in Log */}
            <div className="w-72 flex-shrink-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-center">Recent Check-in Activity</h3>
              {loadingLogs ? (
                <div className="text-neutral-500">Loading logs...</div>
              ) : checkInLog.length > 0 ? (
                <div className="flex flex-col">
                  <div className="h-96 overflow-y-auto border rounded p-3 bg-neutral-50 dark:bg-neutral-800">
                    {paginatedLogs.map((entry, index) => {
                      // Try to get the user name from the current users list if not in log
                      let displayName = entry.userName;
                      if (!displayName && entry.userId) {
                        const user = users.find(u => u._id === entry.userId);
                        displayName = user ? user.fullName : 'Unknown User';
                      }
                      
                      return (
                        <div 
                          key={entry._id || entry.id} 
                          className="text-sm py-1 border-b last:border-b-0"
                        >
                          <span className="font-medium">{displayName}</span> was{' '}
                          <span className={entry.action === 'checked in' ? 'text-green-600' : 'text-red-600'}>
                            {entry.action}
                          </span>{' '}
                          at {new Date(entry.timestamp).toLocaleTimeString()} by {entry.checkedInBy}
                        </div>
                      );
                    })}
                  </div>
                  {/* Pagination controls for logs */}
                  {totalLogPages > 1 && (
                    <div className="flex justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLogPage(prev => Math.max(1, prev - 1))}
                        disabled={logPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="self-center">Page {logPage} of {totalLogPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLogPage(prev => Math.min(totalLogPages, prev + 1))}
                        disabled={logPage === totalLogPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                  {/* Navigation arrows for current page */}
                  {/*
                  <div className="flex justify-center gap-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLogIndex(prev => Math.max((logPage - 1) * LOGS_PER_PAGE, prev - 1))}
                      disabled={selectedLogIndex <= (logPage - 1) * LOGS_PER_PAGE}
                      className="px-2 py-1 text-xs"
                    >
                      ↑
                    </Button>
                                         <span className="self-center text-xs text-neutral-600">
                       {selectedLogIndex + 1} of {checkInLog.length}
                     </span>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => setSelectedLogIndex(prev => Math.min(logPage * LOGS_PER_PAGE - 1, prev + 1))}
                       disabled={selectedLogIndex >= logPage * LOGS_PER_PAGE - 1}
                       className="px-2 py-1 text-xs"
                     >
                       ↓
                     </Button>
                  </div>
                  */}
                </div>
              ) : (
                <div className="text-neutral-500">No check-in activity yet.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 