import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  
  useEffect(() => {
    fetch('/api/public/settings').then(r => r.json()).then(setSettings);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900">Site Settings</h1>
      
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Site Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm px-3 py-2 border" 
              defaultValue={settings.siteName || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Site Description</label>
            <textarea 
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm px-3 py-2 border" 
              rows={4}
              defaultValue={settings.siteDescription || ''}
            />
          </div>
          <div className="pt-4 border-t">
            <button className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
