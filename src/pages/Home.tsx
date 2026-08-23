import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Link } from "react-router-dom";
import { BlogList } from "../components/BlogList";

function ProjectScrollItem({ project, onActive }: { project: any, onActive: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.1 && latest < 0.9) {
      onActive();
    }
  });

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex flex-col justify-center py-24 md:py-0 border-t border-luxury-border md:border-t-0"
    >
      {/* Mobile Image */}
      <div className="md:hidden aspect-[4/3] w-full mb-12 overflow-hidden bg-luxury-surface">
        {project.coverImage && (
          <img src={project.coverImage} className="w-full h-full object-cover grayscale opacity-90" alt={project.title} />
        )}
      </div>
      
      <h2 className="text-heading mb-8">
        {project.title}
      </h2>
      <p className="text-body-large text-luxury-muted max-w-lg mb-12">
        {project.description}
      </p>
      
      <div className="flex items-center gap-6">
        <Link to={`/portfolio`} className="text-sm font-medium border-b border-luxury-border pb-1 hover:text-luxury-accent hover:border-luxury-accent transition-colors">
          View Case Study
        </Link>
        <div className="text-metadata">
          {new Date(project.createdAt || Date.now()).getFullYear()}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    fetch('/api/public/projects').then(r => r.json()).then(p => setProjects(p));
    fetch('/api/public/blog').then(r => r.json()).then(b => setBlogPosts(b.slice(0, 3))); // Get top 3
  }, []);

  // Mock achievements for design presentation
  const achievements = [
    { id: 1, title: "FTC Nusantara Championship", year: "2026" },
    { id: 2, title: "World Championship Finalist", year: "2026" },
    { id: 3, title: "National Robotics Olympiad - Gold", year: "2025" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen pt-48 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto flex flex-col items-center justify-between">
        <div className="text-center w-full max-w-6xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display leading-[0.9] tracking-tighter text-balance"
          >
            I BUILD THINGS THAT MOVE.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 text-body-large text-luxury-muted max-w-lg font-light text-balance"
          >
            Robotics, software, and whatever I'm currently obsessed with.
          </motion.p>
        </div>

        {/* Visual Anchor from CMS */}
        {projects.length > 0 && projects[0].coverImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-24 md:mt-32 relative aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-luxury-surface group cursor-pointer"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <img 
              src={projects[0].coverImage} 
              alt={projects[0].title} 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" 
            />
            {/* Cinematic Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            {/* Anchor Label */}
            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
              <div>
                <div className="text-metadata mb-2">Featured Work</div>
                <div className="text-2xl md:text-3xl font-medium tracking-tight text-luxury-fg">{projects[0].title}</div>
              </div>
              <div className="text-metadata flex items-center gap-4">
                <span>View Project</span>
                <span className="text-luxury-accent">&rarr;</span>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Selected Work */}
      {projects.length > 0 && (
        <section id="work" className="relative w-full px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="py-24 border-b border-luxury-border hidden md:block">
            <h2 className="text-metadata">Selected Work</h2>
          </div>

          <div className="flex flex-col md:flex-row relative">
            {/* Scrolling Content */}
            <div className="w-full md:w-5/12 md:pr-16 lg:pr-24">
              {projects.map((p, i) => (
                <ProjectScrollItem key={p.id} project={p} onActive={() => setActiveProject(i)} />
              ))}
            </div>

            {/* Sticky Image Canvas (Desktop) */}
            <div className="hidden md:block w-7/12 h-[calc(100vh-6rem)] sticky top-24 pb-24">
              <div className="w-full h-full relative overflow-hidden bg-luxury-surface">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={false}
                    animate={{ 
                      opacity: activeProject === i ? 1 : 0,
                      scale: activeProject === i ? 1 : 1.05,
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {p.coverImage && (
                      <img src={p.coverImage} className="w-full h-full object-cover grayscale opacity-90" alt={p.title} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="spacing-section px-6 md:px-12 max-w-5xl mx-auto text-center md:text-left">
        <h2 className="text-heading">
          I like building things where software meets the physical world.
        </h2>
        <div className="spacing-element flex flex-col md:flex-row gap-8 md:gap-16 text-body-large text-luxury-muted justify-center md:text-left md:justify-start">
          <span>Robotics</span>
          <span className="hidden md:block opacity-30">•</span>
          <span>Embedded systems</span>
          <span className="hidden md:block opacity-30">•</span>
          <span>Software</span>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="spacing-section border-t border-luxury-border px-6 md:px-12 max-w-5xl mx-auto">
        <h3 className="text-metadata mb-16">Achievements</h3>
        <div className="space-y-0">
          {achievements.map((a, i) => (
            <motion.div 
              key={a.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-luxury-border py-8 group hover:pl-4 transition-all duration-300 cursor-default"
            >
              <h4 className="text-3xl font-medium tracking-tight text-luxury-fg group-hover:text-luxury-accent transition-colors">
                {a.title}
              </h4>
              <span className="text-metadata mt-4 md:mt-0">
                {a.year}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog / Writing Section */}
      {blogPosts.length > 0 && (
        <section className="spacing-section px-6 md:px-12 max-w-5xl mx-auto">
          <h3 className="text-metadata mb-16">Writing</h3>
          <BlogList posts={blogPosts} />
        </section>
      )}
    </div>
  );
}
