import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AdminLayout() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/status')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) {
          navigate('/admin/login');
        } else {
          setAuth(true);
        }
      })
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  if (auth === null) return <div className="p-8 text-center text-neutral-500">Checking auth...</div>;

  return (
    <div className="min-h-screen flex bg-neutral-100 font-sans">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-semibold text-lg text-neutral-900">
          CMS Admin
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium text-neutral-700">Dashboard</Link>
          <Link to="/admin/projects" className="block px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium text-neutral-700">Projects</Link>
          <Link to="/admin/blog" className="block px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium text-neutral-700">Blog</Link>
          <Link to="/admin/settings" className="block px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium text-neutral-700">Settings</Link>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST' }).then(() => navigate('/admin/login'));
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
