import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ref, get, set, database, isFirebaseConfigured } from '../lib/firebase';
import { SiteData, defaultSiteData, loadSiteData, saveSiteData, normalizeSiteData } from '../lib/store';

interface SiteContextType {
  data: SiteData;
  loading: boolean;
  refresh: () => Promise<void>;
  updateData: (data: SiteData) => Promise<void>;
  firebaseReady: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [firebaseReady] = useState(() => isFirebaseConfigured());

  const loadFromFirebase = async (): Promise<SiteData | null> => {
    if (!firebaseReady) return null;
    try {
      const snapshot = await get(ref(database, 'siteData'));
      if (snapshot.exists()) {
        return normalizeSiteData(snapshot.val());
      }
    } catch (err) {
      console.error('Firebase load error:', err);
    }
    return null;
  };

  const refresh = async () => {
    const fbData = await loadFromFirebase();
    const localData = await loadSiteData();

    if (fbData) {
      setData(fbData);
      await saveSiteData(fbData);
    } else {
      setData(localData);
    }
  };

  const updateData = async (newData: SiteData) => {
    await saveSiteData(newData);
    setData(newData);

    if (firebaseReady) {
      try {
        await set(ref(database, 'siteData'), newData);
      } catch (err) {
        console.error('Firebase save error:', err);
        throw new Error('Erreur lors de la sauvegarde Firebase. Vérifiez la configuration.');
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
    <SiteContext.Provider value={{ data, loading, refresh, updateData, firebaseReady }}>
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
