import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, ProjectContextType, SiteData, Profile, SocialLink } from '../types';
import { INITIAL_PROJECTS, INITIAL_SITE_DATA } from '../constants';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Projects Table
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vizarc_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Site Data Table (Profile, Socials)
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('vizarc_sitedata');
    return saved ? JSON.parse(saved) : INITIAL_SITE_DATA;
  });

  // Persist Data
  useEffect(() => {
    localStorage.setItem('vizarc_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vizarc_sitedata', JSON.stringify(siteData));
  }, [siteData]);

  // Actions
  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProfile = (profile: Partial<Profile>) => {
    setSiteData(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  };

  const updateSocials = (socials: SocialLink[]) => {
    setSiteData(prev => ({ ...prev, socials }));
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      siteData, 
      addProject, 
      updateProject, 
      deleteProject, 
      updateProfile, 
      updateSocials 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
