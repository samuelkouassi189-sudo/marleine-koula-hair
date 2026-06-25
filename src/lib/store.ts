const DB_NAME = 'marleine-koula-db';
const DB_VERSION = 1;
const STORE_NAME = 'siteData';
const KEY = 'current';

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  type: 'url' | 'file';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
}

export interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  services: Service[];
  models: GalleryImage[];
  gallery: GalleryImage[];
  promotions: GalleryImage[];
  videos: Video[];
  testimonials: Testimonial[];
  contact: {
    phone: string;
    phone2: string;
    whatsapp: string;
    address: string;
    hours: string;
    mapLink: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
  adminCode: string;
}

export const defaultSiteData: SiteData = {
  hero: {
    title: 'Votre salon de coiffure de référence à Yopougon',
    subtitle: 'Salon ouvert à Yopougon',
    description:
      'Sublimez votre beauté grâce au savoir-faire de nos coiffeuses professionnelles. Coiffures modernes et élégantes pour toutes les occasions : mariage, anniversaire, cérémonie ou sortie.',
    backgroundImage: '/images/hero-braids.jpg',
  },
  services: [
    {
      id: '1',
      title: 'Coiffures féminines',
      description: 'Tresses, nattes, vanilles, coiffures protectrices et tendances adaptées à votre style.',
      image: '/images/gallery-1.jpg',
      icon: 'Sparkles',
    },
    {
      id: '2',
      title: 'Pose et entretien de perruques',
      description: 'Installation professionnelle pour un rendu naturel et confortable au quotidien.',
      image: '/images/gallery-2.jpg',
      icon: 'Crown',
    },
    {
      id: '3',
      title: 'Soins capillaires',
      description: 'Traitements adaptés pour garder des cheveux sains, forts et éclatants.',
      image: '/images/gallery-4.jpg',
      icon: 'Heart',
    },
    {
      id: '4',
      title: 'Coiffures événementielles',
      description: 'Mariages, anniversaires, baptêmes, remises de diplômes et autres cérémonies.',
      image: '/images/gallery-6.jpg',
      icon: 'Scissors',
    },
  ],
  models: [
    { id: '1', src: '/images/gallery-1.jpg', title: 'Tresses tendance', category: 'Tresses' },
    { id: '2', src: '/images/gallery-2.jpg', title: 'Coiffure événementielle', category: 'Cérémonie' },
    { id: '3', src: '/images/gallery-3.jpg', title: 'Braids protectrices', category: 'Protectrice' },
    { id: '4', src: '/images/gallery-4.jpg', title: 'Soin cheveux naturels', category: 'Soins' },
    { id: '5', src: '/images/gallery-5.jpg', title: 'Twists élégants', category: 'Twists' },
    { id: '6', src: '/images/gallery-6.jpg', title: 'Style glamour', category: 'Glamour' },
  ],
  gallery: [],
  promotions: [],
  videos: [
    {
      id: '1',
      title: 'Coiffure tendance du moment',
      description: 'Découvrez l\'une de nos réalisations les plus appréciées par nos clientes.',
      url: 'https://www.facebook.com/share/r/1BWAevsVcA/',
      thumbnail: '/images/gallery-3.jpg',
      type: 'url',
    },
    {
      id: '2',
      title: 'Transformation capillaire',
      description: 'Avant / Après d\'une mise en beauté réalisée dans notre salon à Yopougon.',
      url: 'https://www.facebook.com/share/r/1Aae3CPBrN/',
      thumbnail: '/images/gallery-5.jpg',
      type: 'url',
    },
    {
      id: '3',
      title: 'Nos réalisations en vidéo',
      description: 'Suivez-nous sur Facebook pour voir toutes nos dernières créations.',
      url: 'https://www.facebook.com/reel/870898212737127/?app=fbl',
      thumbnail: '/images/gallery-6.jpg',
      type: 'url',
    },
  ],
  testimonials: [
    {
      id: '1',
      name: 'Aïcha K.',
      role: 'Cliente régulière',
      text: 'Je ne vais plus nulle part ailleurs ! L\'équipe est super douce, à l\'écoute et mes tresses tiennent parfaitement.',
      rating: 5,
      image: '/images/gallery-1.jpg',
    },
    {
      id: '2',
      name: 'Fatou B.',
      role: 'Pour son mariage',
      text: 'Ma coiffure de mariée était magnifique, tout le monde m\'a complimentée. Merci Marleine Koula Hair !',
      rating: 5,
      image: '/images/gallery-2.jpg',
    },
    {
      id: '3',
      name: 'Grace M.',
      role: 'Nouvelle cliente',
      text: 'Accueil chaleureux, salon propre et service rapide. Je recommande vivement ce salon à Yopougon.',
      rating: 5,
      image: '/images/gallery-4.jpg',
    },
  ],
  contact: {
    phone: '07 89 54 20 86',
    phone2: '07 89 55 20 86',
    whatsapp: '+225 05 01 48 45 48',
    address: 'Yopougon, Abidjan, Côte d\'Ivoire',
    hours: 'Lundi - Samedi : 8h00 - 19h00\nSur rendez-vous le dimanche',
    mapLink: 'https://maps.app.goo.gl/Q3xRkmhaHyoLhkrh6',
  },
  social: {
    facebook: 'https://www.facebook.com/share/r/1BWAevsVcA/',
    instagram: '#',
  },
  adminCode: '123456789',
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function loadSiteData(): Promise<SiteData> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || defaultSiteData);
      };
    });
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(data, KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Firebase sync helpers
export function normalizeSiteData(data: Partial<SiteData>): SiteData {
  return {
    hero: { ...defaultSiteData.hero, ...data.hero },
    services: data.services?.length ? data.services : defaultSiteData.services,
    models: data.models?.length ? data.models : defaultSiteData.models,
    gallery: data.gallery ?? defaultSiteData.gallery,
    promotions: data.promotions ?? defaultSiteData.promotions,
    videos: data.videos?.length ? data.videos : defaultSiteData.videos,
    testimonials: data.testimonials?.length ? data.testimonials : defaultSiteData.testimonials,
    contact: { ...defaultSiteData.contact, ...data.contact },
    social: { ...defaultSiteData.social, ...data.social },
    adminCode: data.adminCode || defaultSiteData.adminCode,
  };
}


export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
