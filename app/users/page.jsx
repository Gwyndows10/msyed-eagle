"use client";
import Sidebar from "@/components/Sidebar";
import Lock from "@/components/lock";
import SignOut from "@/components/signout";
export default function Users() {

  const ui = (<div className="flex h-screen bg-gray-900 text-white">
    {/* Sidebar */}
    <Sidebar />
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold mb-6">Users Page</h1>
      <p>This is the Users page!</p>
      <SignOut/>
    </main>
  </div>)
  return (
    <Lock showUI={ui}/>
  );
}
