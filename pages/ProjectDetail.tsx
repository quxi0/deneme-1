import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20">
      <div className="max-w-[1920px] mx-auto px-6">
        
        {/* Navigation Back */}
        <Link to="/#archive" className="inline-block mb-12 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          ← Index
        </Link>

        {/* Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-8">
            <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter mb-8 leading-[0.9]">
              {project.title}
            </h1>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end">
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              {project.description}
            </p>
          </div>
        </div>

        {/* Main Hero Image */}
        <div className="w-full aspect-video bg-gray-900 mb-24">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Technical Specification Grid */}
        <div className="border-t border-white/10 pt-12 mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2">Location</h3>
              <p className="font-serif text-xl">{project.location}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2">Year</h3>
              <p className="font-serif text-xl">{project.year}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2">Typology</h3>
              <p className="font-serif text-xl">{project.typology}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2">Software</h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span key={idx} className="border border-white/10 px-2 py-1 text-xs text-gray-400">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative / Additional Gallery */}
        <div className="space-y-24">
          {project.gallery && project.gallery.map((img, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${index % 2 === 0 ? '' : 'direction-rtl'}`}>
               <div className="md:col-span-8">
                 <img src={img} alt="Detail" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
               </div>
               <div className="md:col-span-4 p-8">
                 <span className="block text-xs uppercase tracking-widest text-gray-500 mb-4">Fig. 0{index + 1}</span>
                 <p className="font-serif text-2xl text-white">
                   {index === 0 ? "Parametric articulation of form." : "Environmental synthesis and light studies."}
                 </p>
               </div>
            </div>
          ))}
        </div>

        {/* Next Project CTA (Mock logic) */}
        <div className="mt-32 pt-32 border-t border-white/10 text-center">
          <Link to="/" className="text-4xl md:text-6xl font-serif hover:text-gray-400 transition-colors">
            Next Project →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;