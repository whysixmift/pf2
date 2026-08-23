import { useEffect, useState } from "react";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    coverImage: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
    published: false,
    featured: false
  });

  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      description: project.description || "",
      longDescription: project.longDescription || "",
      coverImage: project.coverImage || "",
      technologies: project.technologies || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      published: project.published || false,
      featured: project.featured || false
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      coverImage: "",
      technologies: "",
      projectUrl: "",
      githubUrl: "",
      published: false,
      featured: false
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentProject ? `/api/admin/projects/${currentProject.id}` : '/api/admin/projects';
    const method = currentProject ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{currentProject ? 'Edit Project' : 'New Project'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-neutral-600 hover:text-neutral-900">
            Cancel
          </button>
        </div>
        
        <form onSubmit={handleSave} className="bg-white shadow-sm rounded-lg border border-neutral-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Slug</label>
              <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Short Description</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Cover Image URL</label>
              <input type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Technologies (comma separated)</label>
              <input type="text" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Project URL</label>
              <input type="url" value={formData.projectUrl} onChange={e => setFormData({...formData, projectUrl: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">GitHub URL</label>
              <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500" />
            </div>
            
            <div className="flex items-center gap-6 mt-4">
              <label className="flex items-center">
                <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                <span className="ml-2 text-sm text-neutral-700">Published</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                <span className="ml-2 text-sm text-neutral-700">Featured</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button type="submit" className="bg-neutral-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-neutral-800">
              Save Project
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
        <button onClick={handleAddNew} className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800">
          Add Project
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
            ) : projects.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">No projects found.</td></tr>
            ) : (
              projects.map(p => (
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
