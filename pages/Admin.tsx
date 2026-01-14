import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Project, ProjectButton, SocialLink } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const AdminPage: React.FC = () => {
  const { projects, siteData, addProject, deleteProject, updateProfile, updateSocials } = useProjects();
  const { isAuthenticated, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<'projects' | 'content' | 'socials'>('projects');

  // --- PROJECT STATE ---
  const [pTitle, setPTitle] = useState('');
  const [pLocation, setPLocation] = useState('');
  const [pTypology, setPTypology] = useState('');
  const [pTools, setPTools] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImg, setPImg] = useState('');
  // Custom Button Builder State
  const [btnLabel, setBtnLabel] = useState('');
  const [btnUrl, setBtnUrl] = useState('');
  const [projectButtons, setProjectButtons] = useState<ProjectButton[]>([]);

  // --- CONTENT STATE ---
  const [shortBio, setShortBio] = useState(siteData.profile.shortBio);
  const [longBio, setLongBio] = useState(siteData.profile.longBio);

  // --- SOCIALS STATE ---
  const [socials, setSocials] = useState<SocialLink[]>(siteData.socials);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Handlers
  const handleAddButton = () => {
    if(!btnLabel || !btnUrl) return;
    setProjectButtons([...projectButtons, { id: nanoid(), label: btnLabel, url: btnUrl, style: 'outline' }]);
    setBtnLabel(''); setBtnUrl('');
  };

  const handlePublishProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: nanoid(),
      title: pTitle,
      location: pLocation,
      year: new Date().getFullYear().toString(),
      typology: pTypology,
      tools: pTools.split(','),
      imageUrl: pImg || `https://picsum.photos/1200/800?grayscale&random=${Date.now()}`,
      gallery: [],
      description: pDesc,
      customButtons: projectButtons
    };
    addProject(newProject);
    // Reset
    setPTitle(''); setPLocation(''); setPTypology(''); setPTools(''); setPDesc(''); setPImg(''); setProjectButtons([]);
  };

  const handleSaveProfile = () => {
    updateProfile({ shortBio, longBio });
    alert('Profile Updated');
  };

  const handleSocialChange = (id: string, val: string) => {
    const updated = socials.map(s => s.id === id ? { ...s, url: val } : s);
    setSocials(updated);
  };

  const saveSocials = () => {
    updateSocials(socials);
    alert('Connectivity Hub Updated');
  };

  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0a] text-gray-200 flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed h-full border-r border-white/10 p-6">
        <h1 className="text-xl font-serif mb-12 tracking-tight">vizarc console.</h1>
        <nav className="space-y-4">
          <button onClick={() => setActiveModule('projects')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'projects' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Projects</button>
          <button onClick={() => setActiveModule('content')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'content' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Content Hub</button>
          <button onClick={() => setActiveModule('socials')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'socials' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Socials</button>
        </nav>
        <button onClick={logout} className="mt-20 text-red-500 text-xs uppercase tracking-widest w-full text-left px-4">Logout</button>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-12 max-w-5xl">
        
        {/* MODULE: PROJECT MANAGER */}
        {activeModule === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#111] p-8 border border-white/5">
              <h2 className="text-lg font-serif mb-6 border-b border-white/10 pb-2">New Entry</h2>
              <form onSubmit={handlePublishProject} className="space-y-4">
                <input value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Project Title" className="w-full bg-black border border-white/20 p-3 text-sm focus:border-white outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input value={pLocation} onChange={e => setPLocation(e.target.value)} placeholder="Location" className="bg-black border border-white/20 p-3 text-sm outline-none" required />
                  <input value={pTypology} onChange={e => setPTypology(e.target.value)} placeholder="Typology" className="bg-black border border-white/20 p-3 text-sm outline-none" required />
                </div>
                <input value={pTools} onChange={e => setPTools(e.target.value)} placeholder="Software (comma separated)" className="w-full bg-black border border-white/20 p-3 text-sm outline-none" />
                <input value={pImg} onChange={e => setPImg(e.target.value)} placeholder="Image URL" className="w-full bg-black border border-white/20 p-3 text-sm outline-none" />
                <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Architectural Narrative..." className="w-full bg-black border border-white/20 p-3 text-sm outline-none h-32" />
                
                {/* Dynamic Button Builder */}
                <div className="bg-gray-900 p-4 border border-white/5">
                  <h3 className="text-xs uppercase text-gray-500 mb-2">Component Builder: Action Buttons</h3>
                  <div className="flex gap-2 mb-2">
                    <input value={btnLabel} onChange={e => setBtnLabel(e.target.value)} placeholder="Label" className="bg-black border border-white/20 p-2 text-xs flex-1" />
                    <input value={btnUrl} onChange={e => setBtnUrl(e.target.value)} placeholder="URL" className="bg-black border border-white/20 p-2 text-xs flex-1" />
                    <button type="button" onClick={handleAddButton} className="bg-white text-black px-3 text-xs uppercase">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectButtons.map(b => (
                      <span key={b.id} className="text-[10px] bg-white/10 px-2 py-1 border border-white/20">{b.label}</span>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 uppercase tracking-widest text-xs font-bold transition-colors">
                  Publish to Database
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-serif mb-6 border-b border-white/10 pb-2">Database Index ({projects.length})</h2>
              {projects.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-[#111] border border-white/5 group hover:border-white/20">
                  <div>
                    <h3 className="font-serif text-white">{p.title}</h3>
                    <p className="text-xs text-gray-500">{p.typology} — {p.location}</p>
                  </div>
                  <button onClick={() => deleteProject(p.id)} className="text-red-500 hover:text-white text-xs uppercase border border-red-900 px-3 py-1">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE: CONTENT HUB */}
        {activeModule === 'content' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-serif mb-8">Profile Management</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Short Bio (Home)</label>
                <textarea value={shortBio} onChange={e => setShortBio(e.target.value)} className="w-full bg-black border border-white/20 p-4 text-sm text-gray-300 h-32 focus:border-white outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Long Bio (About Page)</label>
                <textarea value={longBio} onChange={e => setLongBio(e.target.value)} className="w-full bg-black border border-white/20 p-4 text-sm text-gray-300 h-64 focus:border-white outline-none" />
              </div>
              <button onClick={handleSaveProfile} className="bg-white text-black px-8 py-3 uppercase tracking-widest text-xs font-bold">Save Changes</button>
            </div>
          </div>
        )}

        {/* MODULE: SOCIALS */}
        {activeModule === 'socials' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif mb-8">Connectivity Hub</h2>
            <div className="space-y-4 bg-[#111] p-8 border border-white/5">
              {socials.map(s => (
                <div key={s.id} className="flex items-center gap-4">
                  <span className="w-24 text-xs uppercase tracking-widest text-gray-500">{s.platform}</span>
                  <input 
                    value={s.url} 
                    onChange={e => handleSocialChange(s.id, e.target.value)}
                    className="flex-1 bg-black border border-white/20 p-3 text-sm text-white focus:border-white outline-none"
                  />
                </div>
              ))}
              <div className="pt-6">
                <button onClick={saveSocials} className="bg-white text-black px-8 py-3 uppercase tracking-widest text-xs font-bold w-full">Update Links</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPage;
