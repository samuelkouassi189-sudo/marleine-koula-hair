import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isFirebaseConfigured, database, ref, get, set } from '../lib/firebase';
import {
  getAuthenticatedUser,
  fetchSiteDataFromGitHub,
  saveSiteDataToGitHub,
} from '../lib/github';
import { SiteData, defaultSiteData, loadSiteData, saveSiteData, normalizeSiteData } from '../lib/store';

interface SiteContextType {
  data: SiteData;
  loading: boolean;
  refresh: () => Promise<void>;
  updateData: (data: SiteData) => Promise<void>;
  firebaseReady: boolean;
  githubReady: boolean;
  githubOwner: string | null;
  githubToken: string | null;
  setGithubToken: (token: string | null) => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const GITHUB_TOKEN_KEY = 'mkh_github_token';
const GITHUB_OWNER_KEY = 'mkh_github_owner';

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [firebaseReady] = useState(() => isFirebaseConfigured());
  const [githubToken, setGithubTokenState] = useState<string | null>(localStorage.getItem(GITHUB_TOKEN_KEY));
  const [githubOwner, setGithubOwner] = useState<string | null>(localStorage.getItem(GITHUB_OWNER_KEY));

  const loadFromFirebase = async (): Promise<SiteData | null> => {
    if (!isFirebaseConfigured()) return null;
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

  const loadFromGitHub = async (): Promise<SiteData | null> => {
    if (!githubOwner) return null;
    try {
      const raw = await fetchSiteDataFromGitHub(githubOwner);
      if (raw) return normalizeSiteData(raw);
    } catch (err) {
      console.error('GitHub load error:', err);
    }
    return null;
  };

  const refresh = async () => {
    // Priority: GitHub > Firebase > Local
    const ghData = await loadFromGitHub();
    if (ghData) {
      setData(ghData);
      await saveSiteData(ghData);
      return;
    }

    const fbData = await loadFromFirebase();
    if (fbData) {
      setData(fbData);
      await saveSiteData(fbData);
      return;
    }

    const localData = await loadSiteData();
    setData(localData);
  };

  const updateData = async (newData: SiteData) => {
    await saveSiteData(newData);
    setData(newData);

    if (githubToken && githubOwner) {
      try {
        await saveSiteDataToGitHub(githubToken, githubOwner, newData);
      } catch (err) {
        console.error('GitHub save error:', err);
        throw new Error('Erreur lors de la sauvegarde GitHub.');
      }
    }

    if (isFirebaseConfigured()) {
      try {
        await set(ref(database, 'siteData'), newData);
      } catch (err) {
        console.error('Firebase save error:', err);
      }
    }
  };

  const setGithubToken = async (token: string | null): Promise<boolean> => {
    if (!token) {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
      localStorage.removeItem(GITHUB_OWNER_KEY);
      setGithubTokenState(null);
      setGithubOwner(null);
      return false;
    }

    const user = await getAuthenticatedUser(token);
    if (!user) return false;

    localStorage.setItem(GITHUB_TOKEN_KEY, token);
    localStorage.setItem(GITHUB_OWNER_KEY, user.login);
    setGithubTokenState(token);
    setGithubOwner(user.login);

    // Try to load data from GitHub immediately
    const ghData = await fetchSiteDataFromGitHub(user.login);
    if (ghData) {
      const normalized = normalizeSiteData(ghData);
      setData(normalized);
      await saveSiteData(normalized);
    }

    return true;
  };

  useEffect(() => {
    const init = async () => {
      await refresh();
      setLoading(false);
    };
    init();
  }, [githubOwner]);

  return (
    <SiteContext.Provider
      value={{
        data,
        loading,
        refresh,
        updateData,
        firebaseReady,
        githubReady: !!githubToken && !!githubOwner,
        githubOwner,
        githubToken,
        setGithubToken,
      }}
    >
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
