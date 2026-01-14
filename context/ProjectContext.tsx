import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, ProjectContextType, SiteData, Profile, SocialLink } from '../types';
import { INITIAL_SITE_DATA, INITIAL_PROJECTS } from '../constants';
import { db } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteData, setSiteData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [loading, setLoading] = useState(true);

  // Sync Projects from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const projectsData: Project[] = [];
          querySnapshot.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() } as Project);
          });
          setProjects(projectsData);
          setLoading(false);
        },
        (error) => {
          console.error("Firebase Snapshot Error (Projects):", error);
          if (error.code === 'permission-denied') {
            console.error(">>> PERMISSION DENIED: Check Firestore Rules in Firebase Console.");
          }
          // Fallback only on error to keep UI usable
          if (projects.length === 0) setProjects(INITIAL_PROJECTS);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up project listener:", err);
      setLoading(false);
    }
  }, []);

  // Sync Site Data (Profile/Socials) from Firestore
  useEffect(() => {
    try {
      const docRef = doc(db, "settings", "main");
      const unsubscribe = onSnapshot(docRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            setSiteData(docSnap.data() as SiteData);
          } else {
            // Initialize if doesn't exist
            setDoc(docRef, INITIAL_SITE_DATA).catch(e => console.error("Failed to init site data:", e));
          }
        },
        (error) => {
          console.error("Firebase Snapshot Error (Settings):", error);
          if (error.code === 'permission-denied') {
            console.error(">>> PERMISSION DENIED: Check Firestore Rules in Firebase Console.");
          }
          // Fallback
          setSiteData(INITIAL_SITE_DATA);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up settings listener:", err);
    }
  }, []);

  // --- Actions ---

  const addProject = async (project: Project) => {
    try {
      // Assign an order index (last + 1)
      const newOrder = projects.length > 0 ? (projects[projects.length - 1] as any).order + 1 : 0;
      const { id, ...data } = project; 
      
      console.log("Attempting to add project:", id);
      await setDoc(doc(db, "projects", id), { ...data, order: newOrder });
      console.log("Project added successfully");
    } catch (error: any) {
      console.error("Firebase Write Error [addProject]:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      alert(`Database Error: ${error.message} (See Console)`);
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, updatedProject);
      console.log("Project updated successfully:", id);
    } catch (error: any) {
      console.error("Firebase Write Error [updateProject]:", error);
      console.error("Error Code:", error.code);
      alert(`Database Error: ${error.message} (See Console)`);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      console.log("Project deleted successfully:", id);
    } catch (error: any) {
      console.error("Firebase Delete Error [deleteProject]:", error);
      console.error("Error Code:", error.code);
      alert(`Database Error: ${error.message} (See Console)`);
    }
  };

  const moveProjectUp = async (id: string) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index > 0) {
      const currentPrj = projects[index];
      const prevPrj = projects[index - 1];
      
      try {
        const batch = writeBatch(db);
        const currentRef = doc(db, "projects", currentPrj.id);
        const prevRef = doc(db, "projects", prevPrj.id);

        // Swap orders
        batch.update(currentRef, { order: (prevPrj as any).order });
        batch.update(prevRef, { order: (currentPrj as any).order });

        await batch.commit();
      } catch (error: any) {
        console.error("Firebase Batch Error [moveProjectUp]:", error);
      }
    }
  };

  const moveProjectDown = async (id: string) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index < projects.length - 1) {
      const currentPrj = projects[index];
      const nextPrj = projects[index + 1];

      try {
        const batch = writeBatch(db);
        const currentRef = doc(db, "projects", currentPrj.id);
        const nextRef = doc(db, "projects", nextPrj.id);

        // Swap orders
        batch.update(currentRef, { order: (nextPrj as any).order });
        batch.update(nextRef, { order: (currentPrj as any).order });

        await batch.commit();
      } catch (error: any) {
        console.error("Firebase Batch Error [moveProjectDown]:", error);
      }
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    try {
      const docRef = doc(db, "settings", "main");
      await setDoc(docRef, { ...siteData, profile: { ...siteData.profile, ...profile } }, { merge: true });
    } catch (error: any) {
      console.error("Firebase Write Error [updateProfile]:", error);
      alert(`Database Error: ${error.message}`);
    }
  };

  const updateSocials = async (socials: SocialLink[]) => {
    try {
      const docRef = doc(db, "settings", "main");
      await updateDoc(docRef, { socials });
    } catch (error: any) {
      console.error("Firebase Write Error [updateSocials]:", error);
      alert(`Database Error: ${error.message}`);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      siteData, 
      addProject, 
      updateProject, 
      deleteProject, 
      moveProjectUp,
      moveProjectDown, 
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