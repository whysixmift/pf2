import { useEffect, useState } from "react";
import { BlogList } from "../components/BlogList";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/blog').then(r => r.json()).then(setPosts);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-48 px-6 md:px-12 max-w-5xl mx-auto">
      <header className="spacing-section">
        <h1 className="text-display">Writing</h1>
        <p className="spacing-element text-body-large text-luxury-muted max-w-xl">
          Engineering deep-dives, architectural notes, and technical observations.
        </p>
      </header>

      <BlogList posts={posts} />
    </div>
  );
}
