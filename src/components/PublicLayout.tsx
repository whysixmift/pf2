import { Outlet, Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

export function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollToMenu = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-fg font-sans selection:bg-luxury-accent selection:text-luxury-bg flex flex-col">
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled ? 'bg-luxury-bg/90 backdrop-blur-md py-6' : 'bg-transparent py-8'
        }`}
      >
        <div className="px-6 md:px-12 mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-medium tracking-tight hover:opacity-70 transition-opacity">
            JULIAN
          </Link>
          <nav className="flex items-center gap-6 text-metadata">
            <button 
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-luxury-accent transition-colors"
            >
              Work
            </button>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-luxury-accent transition-colors hidden sm:block"
            >
              About
            </button>
            <Link 
              to="/blog"
              className="hover:text-luxury-accent transition-colors"
            >
              Writing
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <footer id="explore" className="bg-luxury-bg mt-32">
        <div className="px-6 md:px-12 py-32 max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between gap-24">
          
          {/* Navigation Area */}
          <div className="space-y-12 md:w-1/2">
            <h2 className="text-metadata">Keep Exploring</h2>
            <nav className="flex flex-col gap-6">
              <Link to="/portfolio" className="text-heading hover:text-luxury-accent transition-colors w-fit flex items-center gap-4 group">
                WORK <span className="text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-accent">&rarr;</span>
              </Link>
              <Link to="/blog" className="text-heading hover:text-luxury-accent transition-colors w-fit flex items-center gap-4 group">
                BLOG <span className="text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-accent">&rarr;</span>
              </Link>
              <a href="#about" className="text-heading hover:text-luxury-accent transition-colors w-fit flex items-center gap-4 group">
                ABOUT <span className="text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-accent">&rarr;</span>
              </a>
            </nav>
          </div>

          {/* Contact Area */}
          <div className="md:w-1/2 flex flex-col items-start md:items-end justify-between">
            <div className="space-y-8 md:text-right">
              <h2 className="text-display">
                LET'S BUILD<br/>SOMETHING.
              </h2>
              <a href="mailto:hello@example.com" className="inline-block text-lg text-luxury-muted hover:text-luxury-fg transition-colors border-b border-luxury-border hover:border-luxury-fg pb-1">
                hello@example.com
              </a>
            </div>
          </div>

        </div>
        
        <div className="px-6 md:px-12 pb-12 pt-24 text-sm text-luxury-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Julian Mifta</span>
          <span className="font-light">Crafted with precision.</span>
        </div>
      </footer>
    </div>
  );
}
