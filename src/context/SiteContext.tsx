import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ref, get, set, database, isFirebaseConfigured } from '../lib/firebase';
import { isGitHubConfigured, loadSiteDataFromGitHub, saveSiteDataToGitHub } from '../lib/github';
import { SiteData, defaultSiteData, loadSiteData, saveSiteData, normalizeSiteData } from '../lib/store';

interface SiteContextType {
  data: SiteData;
  loading: boolean;
  refresh: () => Promise<void>;
  updateData: (data: SiteData) => Promise<void>;
  firebaseReady: boolean;
  githubReady: boolean;
  syncMethod: 'local' | 'firebase' | 'github';
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [firebaseReady] = useState(() => isFirebaseConfigured());
  const [githubReady] = useState(() => isGitHubConfigured());

  const syncMethod = firebaseReady ? 'firebase' : githubReady ? 'github' : 'local';

  const loadFromRemote = async (): Promise<SiteData | null> => {
    if (firebaseReady) {
      try {
        const snapshot = await get(ref(database, 'siteData'));
        if (snapshot.exists()) {
          return normalizeSiteData(snapshot.val());
        }
      } catch (err) {
        console.error('Firebase load error:', err);
      }
    }

    if (githubReady) {
      try {
        const ghData = await loadSiteDataFromGitHub();
        if (ghData) return normalizeSiteData(ghData);
      } catch (err) {
        console.error('GitHub load error:', err);
      }
    }

    return null;
  };

  const refresh = async () => {
    const remoteData = await loadFromRemote();
    const localData = await loadSiteData();

    if (remoteData) {
      setData(remoteData);
      await saveSiteData(remoteData);
    } else {
      setData(localData);
    }
  };

  const updateData = async (newData: SiteData) => {
    // Always save locally first
    await saveSiteData(newData);
    setData(newData);

    // Save to remote if configured
    if (firebaseReady) {
      try {
        await set(ref(database, 'siteData'), newData);
      } catch (err) {
        console.error('Firebase save error:', err);
        throw new Error('Erreur lors de la sauvegarde Firebase. Vérifiez la configuration.');
      }
    }

    if (githubReady) {
      try {
        await saveSiteDataToGitHub(newData);
      } catch (err) {
        console.error('GitHub save error:', err);
        throw new Error('Erreur lors de la sauvegarde GitHub. Vérifiez le token et le repository.');
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await refresh();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <SiteContext.Provider value={{ data, loading, refresh, updateData, firebaseReady, githubReady, syncMethod }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
