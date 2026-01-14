import { Project, SiteData } from './types';

export const INITIAL_SITE_DATA: SiteData = {
  profile: {
    shortBio: "My practice navigates the threshold between the built and the imagined. With a foundation in architectural theory and a mastery of digital computation, I construct spatial narratives that prioritize tectonic clarity and atmospheric synthesis.",
    longBio: "In an era of digital saturation, the role of the architectural visualizer transcends mere representation; it becomes an act of digital craftsmanship. My work explores the phenomenology of unbuilt spaces, utilizing parametric fluidity to interrogate light, material, and void.\n\nI specialize in translating complex tectonic systems into emotive visual stories. By bridging the gap between technical rigor and artistic intuition, I help world-class studios communicate the soul of their designs before a single foundation is poured.",
    cvUrl: "#",
    portraitUrl: "https://picsum.photos/400/400?grayscale"
  },
  socials: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com' },
    { id: '3', platform: 'Behance', url: 'https://behance.net' }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'The Void House',
    location: 'Kyoto, Japan',
    year: '2023',
    typology: 'Residential',
    tools: ['Rhino', 'V-Ray', 'Photoshop'],
    imageUrl: 'https://picsum.photos/1200/800?grayscale&random=1',
    gallery: [
       'https://picsum.photos/800/600?grayscale&random=10',
       'https://picsum.photos/800/600?grayscale&random=11'
    ],
    description: 'A monolithic concrete residence that explores the spatial tension between light and shadow. The design prioritizes tectonic integrity over ornamentation, creating an atmospheric visualization of silence within the urban density.',
    customButtons: []
  },
  {
    id: '2',
    title: 'Museum of Ephemera',
    location: 'Helsinki, Finland',
    year: '2024',
    typology: 'Cultural',
    tools: ['Maya', 'Unreal Engine 5'],
    imageUrl: 'https://picsum.photos/1200/800?grayscale&random=2',
    gallery: [
       'https://picsum.photos/800/600?grayscale&random=12'
    ],
    description: 'Investigating the digital craftsmanship of transient spaces. This cultural center utilizes parametric skins to manipulate environmental light, resulting in a constantly shifting spatial narrative.',
    customButtons: [
      { id: 'btn_1', label: 'View VR Walkthrough', url: '#', style: 'outline' }
    ]
  }
];

export const NAV_LINKS = [
  { label: 'Portfolio', path: '/#portfolio' }, // Restored Portfolio
  { label: 'Projects', path: '/#portfolio' },  // Added Projects
  { label: 'About', path: '/#about' },
  { label: 'Contact', path: '/#contact' },
];
