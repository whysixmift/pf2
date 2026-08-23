import { ArrowRight, Palette, Type, Layout } from "lucide-react";

export default function DesignShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Design System Concepts</h1>
        <p className="text-lg text-neutral-600">
          Compare three distinct visual directions for your portfolio. Review how colors, typography, and spacing fundamentally change the feel of the exact same content.
        </p>
      </header>

      {/* 1. Minimalist Concept */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-neutral-800 tracking-wide uppercase">01. The Minimalist</h2>
          <p className="text-neutral-500">Maximum white space, ultra-clean lines, typography-driven, zero distractions.</p>
        </div>
        
        <div className="bg-white border-y border-neutral-200 py-16 px-8 sm:px-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400"><Palette className="w-4 h-4"/> Palette</h3>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-xs text-neutral-400">White</div>
                  <div className="w-16 h-16 bg-neutral-100 rounded-full"></div>
                  <div className="w-16 h-16 bg-neutral-900 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400"><Type className="w-4 h-4"/> Typography</h3>
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-neutral-900">Display Heading</h1>
                  <h2 className="text-xl font-normal text-neutral-600">Section Subtitle</h2>
                  <p className="text-neutral-500 leading-relaxed font-light">Clean, readable body text with generous line height and subdued contrast.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400"><Layout className="w-4 h-4"/> Components</h3>
              <div className="space-y-8">
                {/* Minimalist Card */}
                <div className="border-b border-neutral-200 pb-8 space-y-4">
                  <div className="text-xs tracking-widest text-neutral-400 uppercase">Featured Work</div>
                  <h3 className="text-2xl font-normal text-neutral-900">Headless CMS Platform</h3>
                  <p className="text-neutral-500 font-light leading-relaxed">A refined content management system built with ultra-minimal architecture.</p>
                  <button className="text-neutral-900 hover:text-neutral-500 transition-colors uppercase tracking-widest text-xs inline-flex items-center gap-2">
                    View Project <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                {/* Minimalist Buttons */}
                <div className="flex gap-4">
                  <button className="bg-neutral-900 text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors">Primary</button>
                  <button className="border border-neutral-300 text-neutral-900 px-8 py-3 text-sm tracking-widest uppercase hover:border-neutral-900 transition-colors">Secondary</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brutalist Concept */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-black tracking-tighter uppercase">02. The Brutalist</h2>
          <p className="text-neutral-600">High contrast, harsh shadows, bold borders, unapologetic design.</p>
        </div>
        
        <div className="bg-[#f4f4f0] border-4 border-black p-8 sm:p-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter text-black"><Palette className="w-4 h-4"/> Palette</h3>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#f4f4f0] border-4 border-black flex items-center justify-center text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Bg</div>
                  <div className="w-16 h-16 bg-[#00ff00] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                  <div className="w-16 h-16 bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter text-black"><Type className="w-4 h-4"/> Typography</h3>
                <div className="space-y-4">
                  <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none">LOUD HEADING</h1>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-black border-b-4 border-black pb-1 inline-block">Section Title</h2>
                  <p className="text-black font-medium leading-tight border-l-4 border-black pl-4">Chunky body text. No subtle grays. Everything is high contrast and demands attention.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter text-black"><Layout className="w-4 h-4"/> Components</h3>
              <div className="space-y-12">
                {/* Brutalist Card */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="bg-[#00ff00] text-black text-xs font-black uppercase inline-block px-2 py-1 border-2 border-black">New</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Content System</h3>
                  <p className="font-medium text-black">A robust CMS built with raw HTML energy and modern tooling.</p>
                  <button className="text-black font-bold uppercase underline decoration-4 underline-offset-4 hover:bg-black hover:text-[#00ff00] transition-colors p-1">
                    View Project &rarr;
                  </button>
                </div>
                {/* Brutalist Buttons */}
                <div className="flex gap-6">
                  <button className="bg-[#00ff00] text-black border-4 border-black px-8 py-3 font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    Action
                  </button>
                  <button className="bg-white text-black border-4 border-black px-8 py-3 font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Modern Professional Concept */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">03. Modern Professional (SaaS Style)</h2>
          <p className="text-slate-500">Soft shadows, rounded corners, subtle gradients, highly accessible and trustworthy.</p>
        </div>
        
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-16 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider"><Palette className="w-4 h-4"/> Palette</h3>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-xs text-slate-400">Base</div>
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
                  <div className="w-16 h-16 bg-blue-600 rounded-xl shadow-md shadow-blue-600/20"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider"><Type className="w-4 h-4"/> Typography</h3>
                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Platform Heading</h1>
                  <h2 className="text-xl font-semibold text-slate-700">Interface Subtitle</h2>
                  <p className="text-slate-600 leading-relaxed">Crisp, friendly body text using modern geometric sans-serif styling for maximum legibility.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider"><Layout className="w-4 h-4"/> Components</h3>
              <div className="space-y-8">
                {/* SaaS Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all space-y-4 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Digital Product</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">A beautifully structured application interface with focus on user experience.</p>
                  </div>
                </div>
                {/* SaaS Buttons */}
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                    Primary Action
                  </button>
                  <button className="bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-slate-50 transition-all focus:ring-2 focus:ring-slate-200 focus:ring-offset-2">
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
