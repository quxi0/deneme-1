import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useUI } from '../context/UIContext';
import CustomCursor from './CustomCursor';
import ConnectModal from './ConnectModal';
import SocialHub from './SocialHub';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { siteData } = useProjects();
  const { openConnect } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, link: { label: string, path: string }) => {
    e.preventDefault();
    
    // Special handling for scrolling within Home
    if (link.label === 'Portfolio' || link.label === 'Projects' || link.label === 'About') {
      let targetId = 'about'; // Default to about for Portfolio/About
      
      if (link.label === 'Projects') {
        targetId = 'portfolio';
      } else if (link.label === 'Portfolio' || link.label === 'About') {
        targetId = 'about';
      }
      
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.label === 'Contact') {
      openConnect();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#e5e5e5] selection:bg-white selection:text-black relative">
      {/* Global Grain Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-[5] opacity-[0.04] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <CustomCursor />
      <ConnectModal />
      <SocialHub />

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-[#050505]/80 backdrop-blur-md border-white/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-[1920px] mx-auto px-6 flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-serif tracking-tighter hover:opacity-70 transition-opacity mix-blend-difference z-50 relative">
            vizarc.
          </NavLink>
          
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors mix-blend-difference cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            
            {isAuthenticated ? (
               <div className="flex gap-4 border-l border-white/20 pl-6 ml-2">
                 <NavLink to="/admin" className="text-xs uppercase tracking-[0.2em] text-white">Console</NavLink>
               </div>
            ) : (
               <NavLink to="/login" className="text-xs uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 ml-4 mix-blend-difference">
                 Login
               </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-0 relative z-10">
        {children}
      </main>

      <footer id="contact" className="border-t border-white/10 mt-0 bg-[#0a0a0a] relative z-20">
        <div className="max-w-[1920px] mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
               <span className="block text-xs uppercase tracking-widest text-gray-500 mb-6">Connectivity Hub</span>
               <h3 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
                 Let's construct<br/>the narrative.
               </h3>
               <button onClick={openConnect} className="text-xl text-white border-b border-white pb-1 hover:opacity-70 transition-opacity">
                 contact@vizarc.com
               </button>
            </div>
            
            <div className="flex flex-col justify-end items-start md:items-end gap-6">
               <p className="text-right text-gray-500 text-sm max-w-xs leading-relaxed">
                 {siteData.profile.shortBio}
               </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/5 pt-8">
            <div className="text-xs text-gray-700 uppercase tracking-widest">
              © {new Date().getFullYear()} vizarc. Tectonic Integrity.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;