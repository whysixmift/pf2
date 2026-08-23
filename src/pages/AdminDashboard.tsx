import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats/Links */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-neutral-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-500 truncate">Projects</h3>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">Manage Work</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <Link to="/admin/projects" className="text-sm font-medium text-blue-600 hover:text-blue-900">View all &rarr;</Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-neutral-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-500 truncate">Blog</h3>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">Writing</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <Link to="/admin/blog" className="text-sm font-medium text-blue-600 hover:text-blue-900">View posts &rarr;</Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-neutral-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-500 truncate">Settings</h3>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">Configuration</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <Link to="/admin/settings" className="text-sm font-medium text-blue-600 hover:text-blue-900">Edit settings &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
