import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { useProjects } from '../context/ProjectContext';

const ConnectModal: React.FC = () => {
  const { isConnectOpen, closeConnect } = useUI();
  const { siteData } = useProjects();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally trigger a toast notification here
  };

  return (
    <AnimatePresence>
      {isConnectOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
        >
          {/* Backdrop Blur Layer */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-[15px]"
            onClick={closeConnect}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-12 overflow-hidden shadow-2xl"
          >
            {/* Watermark Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap content-center justify-center gap-8 overflow-hidden transform -rotate-12 scale-150">
              {Array.from({ length: 20 }).map((_, i) => (
                 <span key={i} className="text-6xl font-serif font-bold text-white whitespace-nowrap">vizarc</span>
              ))}
            </div>

            <button 
              onClick={closeConnect}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              [Close]
            </button>

            <div className="relative z-10">
              <span className="block text-xs uppercase tracking-[0.3em] text-blue-500 mb-8">Establish Connection</span>
              
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">
                Initiate collaboration <br/>
                <span className="text-gray-500 italic">or general inquiry.</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div 
                  className="group cursor-pointer"
                  onClick={() => copyToClipboard('contact@vizarc.com')}
                >
                   <span className="block text-[10px] uppercase tracking-widest text-gray-600 mb-2 group-hover:text-white transition-colors">Email Channel</span>
                   <p className="font-mono text-lg text-white border-b border-white/10 pb-2 group-hover:border-blue-500 transition-colors">
                     contact@vizarc.com
                   </p>
                   <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</span>
                </div>

                <div className="group">
                   <span className="block text-[10px] uppercase tracking-widest text-gray-600 mb-2">Studio Location</span>
                   <p className="font-mono text-lg text-gray-300 border-b border-white/10 pb-2">
                     Kyoto, JP / Global
                   </p>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                <div className="flex gap-6">
                  {siteData.socials.map(s => (
                    <a key={s.id} href={s.url} target="_blank" className="text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">{s.platform}</a>
                  ))}
                </div>
                <div className="text-[10px] text-gray-600 font-mono">
                  ID: VZ-2025-ARCH
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectModal;
