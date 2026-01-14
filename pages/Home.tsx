import React from 'react';
import { Link } from 'react-router-dom';
import ScrollSequence from '../components/ScrollSequence';
import { useProjects } from '../context/ProjectContext';
import { useUI } from '../context/UIContext';

const HomePage: React.FC = () => {
  const { projects, siteData } = useProjects();
  const { openConnect } = useUI();

  return (
    <div className="bg-[#050505]">
      {/* Hero / Scroll Sequence Section */}
      <section className="relative z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none mix-blend-difference z-20">
           <h1 className="text-7xl md:text-[10rem] font-serif text-white opacity-90 tracking-tighter leading-none">
             vizarc.
           </h1>
           <p className="mt-6 text-sm md:text-base uppercase tracking-[0.6em] font-light text-gray-300">
             Digital Craftsmanship
           </p>
        </div>
        <ScrollSequence />
      </section>

      {/* Dynamic Short Bio Section */}
      <section id="about" className="py-32 px-6 max-w-5xl mx-auto border-b border-white/5">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
             <span className="block text-xs uppercase tracking-widest text-gray-500 mb-4">The Architect</span>
             <img src={siteData.profile.portraitUrl} alt="Portrait" className="w-full aspect-square object-cover grayscale opacity-80" />
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-8 text-white">
              Navigating the threshold.
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-lg md:text-xl">
              {siteData.profile.shortBio}
            </p>
            <div className="mt-8 flex gap-4">
               <button onClick={openConnect} className="text-xs uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all">
                 Connect
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="py-32">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-4">
            <h3 className="text-4xl font-serif">Selected Works</h3>
            <span className="hidden md:block text-xs uppercase tracking-widest text-gray-500">
              Database: {projects.length} Entries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
            {projects.map((project, index) => (
              <Link to={`/project/${project.id}`} key={project.id} className={`group cursor-pointer block ${index % 2 === 1 ? 'md:mt-32' : ''}`}>
                <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-gray-900">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-2xl font-serif group-hover:text-white transition-colors">{project.title}</h4>
                    <span className="text-xs text-gray-600 font-mono">0{index + 1}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 uppercase tracking-wider font-mono">
                    <span>{project.location}</span>
                    <span className="text-gray-700">/</span>
                    <span>{project.typology}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;