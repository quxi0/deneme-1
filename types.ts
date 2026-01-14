export interface ProjectButton {
  id: string;
  label: string;
  url: string;
  style: 'solid' | 'outline';
}

export interface Project {
  id: string;
  title: string;
  location: string;
  year: string;
  typology: string; // Renamed from category to match arch terms
  tools: string[];
  imageUrl: string; // Hero image
  gallery: string[]; // Additional images
  description: string; // The "Spatial Narrative"
  customButtons: ProjectButton[]; // Dynamic CTA components
}

export interface SocialLink {
  id: string;
  platform: 'Instagram' | 'LinkedIn' | 'Behance' | 'Email';
  url: string;
}

export interface Profile {
  shortBio: string; // For Home
  longBio: string; // For About Page
  cvUrl: string;
  portraitUrl: string;
}

export interface SiteData {
  profile: Profile;
  socials: SocialLink[];
}

export interface ProjectContextType {
  projects: Project[];
  siteData: SiteData;
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProjectUp: (id: string) => void;
  moveProjectDown: (id: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateSocials: (socials: SocialLink[]) => void;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (p: string) => boolean;
  logout: () => void;
}