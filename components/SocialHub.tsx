import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../context/ProjectContext';

const SocialHub: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { siteData } = useProjects();

  return (
    <div 
      className="fixed bottom-8 right-8 z-40 flex flex-col items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 flex flex-col gap-2"
          >
            {siteData.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-xs font-mono uppercase px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors text-right"
              >
                {social.platform}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`
        bg-[#111] border border-white/20 w-12 h-12 flex items-center justify-center 
        transition-all duration-300 cursor-pointer
        ${isHovered ? 'bg-white border-white' : ''}
      `}>
        <div className="relative w-4 h-4">
          <span className={`absolute top-1/2 left-0 w-full h-[1px] bg-white transition-transform ${isHovered ? 'rotate-90 bg-black' : ''}`} />
          <span className={`absolute top-1/2 left-0 w-full h-[1px] bg-white transition-transform ${isHovered ? 'rotate-0 bg-black' : 'rotate-90'}`} />
        </div>
      </div>
    </div>
  );
};

export default SocialHub;
