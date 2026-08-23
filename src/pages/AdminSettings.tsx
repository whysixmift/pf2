import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<{ siteName?: string; siteDescription?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch {
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-neutral-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900">Site Settings</h1>
      
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {message && (
            <div className={`p-3 rounded-md text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700">Site Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm px-3 py-2 border" 
              value={settings.siteName || ''}
              onChange={e => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Site Description</label>
            <textarea 
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm px-3 py-2 border" 
              rows={4}
              value={settings.siteDescription || ''}
              onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
            />
          </div>
          <div className="pt-4 border-t">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
