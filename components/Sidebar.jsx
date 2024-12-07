export default function Sidebar() {
    return (
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
          <a href="/admin" className="block p-2 text-lg bg-gray-700 rounded-md">
            Dashboard
          </a>
          <a
            href="/users"
            className="block p-2 text-lg text-gray-300 hover:bg-gray-700 rounded-md"
          >
            Users
          </a>
        </nav>
      </aside>
    );
  }
  