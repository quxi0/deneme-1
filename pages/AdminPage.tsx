import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Project, ProjectButton, SocialLink } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { generateArchitecturalNarrative } from '../services/geminiService';

const AdminPage: React.FC = () => {
  const { projects, siteData, addProject, updateProject, deleteProject, moveProjectUp, moveProjectDown, updateProfile, updateSocials } = useProjects();
  const { isAuthenticated, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<'projects' | 'content' | 'socials'>('projects');

  // --- PROJECT STATE ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pLocation, setPLocation] = useState('');
  const [pTypology, setPTypology] = useState('');
  const [pTools, setPTools] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImg, setPImg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Gallery State
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryList, setGalleryList] = useState<string[]>([]);

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

  const handleAddGalleryImage = () => {
    if(!galleryInput) return;
    setGalleryList([...galleryList, galleryInput]);
    setGalleryInput('');
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryList(galleryList.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setPTitle(''); setPLocation(''); setPTypology(''); setPTools(''); setPDesc(''); setPImg(''); 
    setProjectButtons([]); setGalleryList([]);
    setEditingId(null);
  };

  const handleEdit = (p: Project) => {
    setPTitle(p.title);
    setPLocation(p.location);
    setPTypology(p.typology);
    setPTools(p.tools.join(', '));
    setPDesc(p.description);
    setPImg(p.imageUrl);
    setGalleryList(p.gallery);
    setProjectButtons(p.customButtons);
    setEditingId(p.id);
    
    // Smooth scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default fallback image if none provided
    const heroImage = pImg || `/assets/rere/project_${Date.now()}.jpg`;
    
    const projectData = {
      title: pTitle,
      location: pLocation,
      year: new Date().getFullYear().toString(),
      typology: pTypology,
      tools: pTools.split(',').map(t => t.trim()),
      imageUrl: heroImage,
      gallery: galleryList,
      description: pDesc,
      customButtons: projectButtons
    };

    if (editingId) {
      updateProject(editingId, projectData);
      alert("Project Updated Successfully.");
    } else {
      addProject({
        id: nanoid(),
        ...projectData
      });
      alert("Project Published Successfully.");
    }
    
    resetForm();
  };

  const handleGenerateNarrative = async () => {
    if (!pTitle || !pLocation) {
      alert("Please enter a Title and Location to generate a narrative.");
      return;
    }
    setIsGenerating(true);
    try {
      const narrative = await generateArchitecturalNarrative(pTitle, pLocation, pTools || pTypology);
      setPDesc(narrative);
    } catch (e) {
      alert("AI Generation failed. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
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
      <aside className="w-64 fixed h-full border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-xl font-serif mb-12 tracking-tight">vizarc console.</h1>
        <nav className="space-y-4">
          <button onClick={() => setActiveModule('projects')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'projects' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Projects</button>
          <button onClick={() => setActiveModule('content')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'content' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Content Hub</button>
          <button onClick={() => setActiveModule('socials')} className={`block w-full text-left text-xs uppercase tracking-widest py-3 px-4 rounded ${activeModule === 'socials' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Socials</button>
        </nav>
        <button onClick={logout} className="mt-20 text-red-500 text-xs uppercase tracking-widest w-full text-left px-4">Logout</button>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 flex-1 p-6 md:p-12 max-w-5xl">
        
        {/* MODULE: PROJECT MANAGER */}
        {activeModule === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#111] p-8 border border-white/5">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                <h2 className="text-lg font-serif">{editingId ? 'Edit Project' : 'New Entry'}</h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-xs uppercase text-gray-500 hover:text-white">Cancel Edit</button>
                )}
              </div>
              
              <form onSubmit={handleSubmitProject} className="space-y-4">
                <input value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Project Title" className="w-full bg-black border border-white/20 p-3 text-sm focus:border-white outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input value={pLocation} onChange={e => setPLocation(e.target.value)} placeholder="Location" className="bg-black border border-white/20 p-3 text-sm outline-none" required />
                  <input value={pTypology} onChange={e => setPTypology(e.target.value)} placeholder="Typology" className="bg-black border border-white/20 p-3 text-sm outline-none" required />
                </div>
                <input value={pTools} onChange={e => setPTools(e.target.value)} placeholder="Software (comma separated)" className="w-full bg-black border border-white/20 p-3 text-sm outline-none" />
                <input value={pImg} onChange={e => setPImg(e.target.value)} placeholder="/assets/rere/img_hero.jpg" className="w-full bg-black border border-white/20 p-3 text-sm outline-none" />
                
                {/* Gallery Upload UI */}
                <div className="bg-gray-900 p-4 border border-white/5">
                  <h3 className="text-xs uppercase text-gray-500 mb-2">Gallery Images</h3>
                  <div className="flex gap-2 mb-2">
                    <input value={galleryInput} onChange={e => setGalleryInput(e.target.value)} placeholder="/assets/rere/img_01.jpg" className="bg-black border border-white/20 p-2 text-xs flex-1" />
                    <button type="button" onClick={handleAddGalleryImage} className="bg-white text-black px-3 text-xs uppercase">+</button>
                  </div>
                  <div className="space-y-1">
                    {galleryList.map((url, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] bg-white/5 p-1 px-2">
                         <span className="truncate w-48 text-gray-400">{url}</span>
                         <button type="button" onClick={() => removeGalleryImage(idx)} className="text-red-500 hover:text-red-400">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Architectural Narrative..." className="w-full bg-black border border-white/20 p-3 text-sm outline-none h-32" />
                  <button 
                    type="button" 
                    onClick={handleGenerateNarrative} 
                    disabled={isGenerating}
                    className="absolute bottom-2 right-2 text-[10px] uppercase bg-white/10 hover:bg-white/20 text-white px-2 py-1 flex items-center gap-1 backdrop-blur-sm"
                  >
                    {isGenerating ? 'Synthesizing...' : 'Generate with AI'}
                    {!isGenerating && <span className="text-blue-400">✧</span>}
                  </button>
                </div>
                
                {/* Dynamic Button Builder */}
                <div className="bg-gray-900 p-4 border border-white/5">
                  <h3 className="text-xs uppercase text-gray-500 mb-2">Action Buttons</h3>
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

                <div className="flex gap-2">
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-transparent border border-white/20 text-white hover:bg-white/10 py-3 uppercase tracking-widest text-xs font-bold transition-colors">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 uppercase tracking-widest text-xs font-bold transition-colors">
                    {editingId ? 'Update Project' : 'Publish to Database'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-serif mb-6 border-b border-white/10 pb-2">Database Index ({projects.length})</h2>
              {projects.map((p, index) => (
                <div key={p.id} className={`flex flex-col p-4 border transition-colors ${editingId === p.id ? 'bg-white/10 border-white' : 'bg-[#111] border-white/5 hover:border-white/20'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-white">{p.title}</h3>
                      <p className="text-xs text-gray-500">{p.typology} — {p.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 text-xs uppercase border border-blue-900 px-3 py-1">Edit</button>
                      <button onClick={() => deleteProject(p.id)} className="text-red-500 hover:text-white text-xs uppercase border border-red-900 px-3 py-1">Remove</button>
                    </div>
                  </div>
                  
                  {/* Reordering Controls */}
                  <div className="flex gap-2 mt-2 border-t border-white/5 pt-2">
                     <button 
                       onClick={() => moveProjectUp(p.id)} 
                       disabled={index === 0}
                       className="text-[10px] uppercase text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                     >
                       ↑ Move Up
                     </button>
                     <span className="text-gray-700">|</span>
                     <button 
                       onClick={() => moveProjectDown(p.id)} 
                       disabled={index === projects.length - 1}
                       className="text-[10px] uppercase text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                     >
                       ↓ Move Down
                     </button>
                  </div>
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