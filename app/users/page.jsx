"use client";
import Sidebar from "@/components/sidebar";
export default function Users() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Users Page</h1>
        <p>This is the Users page!</p>
      </main>
    </div>
  );
}
