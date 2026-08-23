import { useEffect, useState } from "react";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  });

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
      }
    } catch {
      alert("Failed to upload cover image.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: any) => {
    setCurrentPost(post);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || "",
      published: post.published || false,
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentPost ? `/api/admin/blog/${currentPost.id}` : '/api/admin/blog';
    const method = currentPost ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{currentPost ? 'Edit Post' : 'New Post'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-neutral-600 hover:text-neutral-900">
            Cancel
          </button>
        </div>
        
        <form onSubmit={handleSave} className="bg-white shadow-sm rounded-lg border border-neutral-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Title</label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={e => {
                  const title = e.target.value;
                  const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setFormData({ ...formData, title, slug: formData.slug || autoSlug });
                }} 
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Slug</label>
              <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Excerpt</label>
              <textarea rows={2} required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Content (Markdown)</label>
              <textarea rows={12} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 font-mono" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Cover Image</label>
              <div className="mt-1 flex items-center gap-4">
                <input 
                  type="text" 
                  value={formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" 
                  placeholder="https://... or /uploads/..." 
                />
                <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-4 py-2 rounded-md text-sm font-medium text-neutral-700">
                  {uploading ? "Uploading..." : "Upload File"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {formData.coverImage && (
                <img src={formData.coverImage} alt="Cover preview" className="mt-2 h-20 w-32 object-cover rounded border border-neutral-200" />
              )}
            </div>
            
            <div className="flex items-center gap-6 mt-4 md:col-span-2">
              <label className="flex items-center">
                <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                <span className="ml-2 text-sm text-neutral-700">Published</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button type="submit" className="bg-neutral-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-neutral-800">
              Save Post
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Blog Posts</h1>
        <button onClick={handleAddNew} className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800">
          New Post
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">No posts found.</td></tr>
            ) : (
              posts.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
