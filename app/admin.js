

export default function Admin() {
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
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          <div className="grid grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Total Users</h2>
              <p className="text-4xl font-bold">10,928</p>
              <p className="text-green-500 mt-2">12% more than previous week</p>
            </div>
  
            {/* Card 2 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Total Users</h2>
              <p className="text-4xl font-bold">10,928</p>
              <p className="text-green-500 mt-2">12% more than previous week</p>
            </div>
  
            {/* Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Total Users</h2>
              <p className="text-4xl font-bold">10,928</p>
              <p className="text-green-500 mt-2">12% more than previous week</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
