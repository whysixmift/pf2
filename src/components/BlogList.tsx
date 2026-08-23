import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function BlogList({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-24 text-metadata text-center border-b border-luxury-border">
        No transmissions yet.
      </div>
    );
  }

  return (
    <div className="group/list border-t border-luxury-border">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link 
            to={`/blog/${post.slug}`}
            className="flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 border-b border-luxury-border group/item hover:!opacity-100 group-hover/list:opacity-40 transition-all duration-500 relative overflow-hidden"
          >
            <div className="max-w-3xl relative z-10 transition-transform duration-500 group-hover/item:translate-x-4">
              <h4 className="text-heading text-luxury-fg">
                {post.title}
              </h4>
            </div>
            
            {/* Metadata reveal on hover */}
            <div className="flex items-center gap-6 mt-6 md:mt-0 text-metadata opacity-100 md:opacity-0 md:-translate-x-8 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-500 relative z-10">
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <span className="text-luxury-accent text-xl leading-none">
                &rarr;
              </span>
            </div>

            {/* Background Hover Image Reveal (Cinematic) */}
            {post.coverImage && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] aspect-[21/9] opacity-0 scale-95 pointer-events-none group-hover/item:opacity-20 group-hover/item:scale-100 transition-all duration-700 z-0 hidden md:block">
                <img src={post.coverImage} alt="" className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-luxury-bg"></div>
              </div>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
