import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/projects').then(r => r.json()).then(setProjects);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-48 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <header className="mb-24">
        <h1 className="text-[12vw] sm:text-[8vw] font-bold tracking-tighter uppercase leading-none">Archive</h1>
        <p className="text-xl text-luxury-muted mt-8 max-w-xl font-light">
          Complete index of projects, systems, and experiments.
        </p>
      </header>

      <div className="grid gap-x-12 gap-y-24 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <div key={p.id} className="group flex flex-col space-y-6">
            <div className="aspect-[4/3] bg-luxury-surface border border-luxury-border overflow-hidden relative">
              {p.coverImage ? (
                <img src={p.coverImage} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={p.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs tracking-widest text-luxury-muted">NO DATA</div>
              )}
              <div className="absolute top-4 left-4 font-mono text-xs bg-luxury-bg/80 backdrop-blur-sm px-2 py-1 text-luxury-fg tracking-widest">
                {String(i+1).padStart(2, '0')}
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold uppercase tracking-tight group-hover:text-luxury-accent transition-colors">{p.title}</h2>
              <p className="text-luxury-muted font-light line-clamp-3">{p.description}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {p.technologies?.split(',').map((t: string) => (
                  <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-luxury-muted border border-luxury-border px-2 py-1">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
