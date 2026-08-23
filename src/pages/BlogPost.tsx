import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/blog')
      .then(r => r.json())
      .then(posts => {
        const p = posts.find((p: any) => p.slug === slug);
        setPost(p);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-luxury-muted tracking-widest uppercase text-sm">Loading Data...</div>;
  
  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold uppercase tracking-tight">Record Not Found</h1>
      <Link to="/blog" className="font-mono text-xs uppercase tracking-widest text-luxury-accent hover:text-white transition-colors">Return to Index</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-48 px-6 md:px-12 max-w-4xl mx-auto">
      <Link to="/blog" className="inline-flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-luxury-muted hover:text-luxury-fg transition-colors mb-24 group">
        <span className="w-8 h-[1px] bg-luxury-border group-hover:bg-luxury-fg transition-colors" /> Back
      </Link>
      
      <article className="space-y-16">
        <header className="space-y-8">
          <div className="font-mono text-xs uppercase tracking-widest text-luxury-accent">
            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[1.1] uppercase">
            {post.title}
          </h1>
        </header>

        {post.coverImage && (
          <div className="aspect-[21/9] w-full overflow-hidden bg-luxury-surface border border-luxury-border">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase 
          prose-p:font-light prose-p:leading-relaxed prose-p:text-luxury-muted
          prose-a:text-luxury-accent prose-a:no-underline hover:prose-a:underline
          prose-code:text-luxury-fg prose-code:bg-luxury-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm
          prose-pre:bg-luxury-surface prose-pre:border prose-pre:border-luxury-border">
          <ReactMarkdown>{post.content || post.excerpt}</ReactMarkdown>
        </div>
      </article>
      
      <div className="mt-32 pt-12 border-t border-luxury-border">
        <Link to="/blog" className="text-3xl font-medium tracking-tight uppercase hover:text-luxury-accent transition-colors">
          Next Article &rarr;
        </Link>
      </div>
    </div>
  );
}
