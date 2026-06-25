import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { isFirebaseConfigured, uploadFileToStorage } from '../lib/firebase';
import { isGitHubConfigured, uploadFileToGitHub } from '../lib/github';
import {
  SiteData,
  Service,
  GalleryImage,
  Video,
  Testimonial,
  generateId,
  fileToBase64,
  formatBytes,
} from '../lib/store';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Home,
  Sparkles,
  AlertCircle,
  CheckCircle,
  LogOut,
  Download,
  Upload,
  User,
  Shield,
  KeyRound,
  Camera,
  Percent,
} from 'lucide-react';

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export default function Admin() {
  const navigate = useNavigate();
  const { data, updateData, loading, firebaseReady, githubReady, syncMethod } = useSite();
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'models' | 'gallery' | 'promotions' | 'videos' | 'testimonials' | 'contact' | 'security'>('general');
  const [edited, setEdited] = useState<SiteData>(data);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEdited(data);
  }, [data]);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    if (firebaseReady) {
      const path = `${folder}/${Date.now()}-${file.name}`;
      return uploadFileToStorage(file, path);
    }
    if (githubReady) {
      return uploadFileToGitHub(file, folder);
    }
    return fileToBase64(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === data.adminCode) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updateData(edited);
    setSaving(false);
    setMessage('Modifications enregistrées avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(edited, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marleine-koula-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Sauvegarde téléchargée');
    setTimeout(() => setMessage(''), 3000);
  };

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setEdited(parsed);
      await updateData(parsed);
      setMessage('Données importées avec succès');
    } catch {
      setError('Fichier invalide. Veuillez importer une sauvegarde JSON valide.');
    }
    e.target.value = '';
    setTimeout(() => setMessage(''), 3000);
  };

  const updateField = <K extends keyof SiteData>(field: K, value: SiteData[K]) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const updateHero = (field: keyof SiteData['hero'], value: string) => {
    setEdited((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateContact = (field: keyof SiteData['contact'], value: string) => {
    setEdited((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const updateSocial = (field: keyof SiteData['social'], value: string) => {
    setEdited((prev) => ({ ...prev, social: { ...prev.social, [field]: value } }));
  };

  // Services
  const addService = () => {
    const newService: Service = {
      id: generateId(),
      title: 'Nouvelle prestation',
      description: 'Description de la prestation',
      image: '/images/gallery-1.jpg',
      icon: 'Sparkles',
    };
    setEdited((prev) => ({ ...prev, services: [...prev.services, newService] }));
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setEdited((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const removeService = (id: string) => {
    setEdited((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  };

  const handleServiceImage = async (id: string, file: File) => {
    const url = await uploadFile(file, 'services');
    updateService(id, 'image', url);
  };

  // Gallery
  const addGalleryImage = () => {
    const newImage: GalleryImage = {
      id: generateId(),
      src: '/images/gallery-1.jpg',
      title: 'Nouvelle photo',
      category: 'Tresses',
    };
    setEdited((prev) => ({ ...prev, gallery: [...prev.gallery, newImage] }));
  };

  const updateGalleryImage = (id: string, field: keyof GalleryImage, value: string) => {
    setEdited((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const removeGalleryImage = (id: string) => {
    setEdited((prev) => ({ ...prev, gallery: prev.gallery.filter((img) => img.id !== id) }));
  };

  const handleGalleryImage = async (id: string, file: File) => {
    const url = await uploadFile(file, 'gallery');
    updateGalleryImage(id, 'src', url);
  };

  // Models
  const addModel = () => {
    const newImage: GalleryImage = { id: generateId(), src: '/images/gallery-1.jpg', title: 'Nouveau modèle', category: 'Tresses' };
    setEdited((prev) => ({ ...prev, models: [...prev.models, newImage] }));
  };

  const updateModel = (id: string, field: keyof GalleryImage, value: string) => {
    setEdited((prev) => ({
      ...prev,
      models: prev.models.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const removeModel = (id: string) => {
    setEdited((prev) => ({ ...prev, models: prev.models.filter((img) => img.id !== id) }));
  };

  const handleModelImage = async (id: string, file: File) => {
    const url = await uploadFile(file, 'models');
    updateModel(id, 'src', url);
  };

  // Promotions
  const addPromotion = () => {
    const newImage: GalleryImage = { id: generateId(), src: '/images/gallery-1.jpg', title: 'Nouvelle promo', category: 'Offre' };
    setEdited((prev) => ({ ...prev, promotions: [...prev.promotions, newImage] }));
  };

  const updatePromotion = (id: string, field: keyof GalleryImage, value: string) => {
    setEdited((prev) => ({
      ...prev,
      promotions: prev.promotions.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const removePromotion = (id: string) => {
    setEdited((prev) => ({ ...prev, promotions: prev.promotions.filter((img) => img.id !== id) }));
  };

  const handlePromotionImage = async (id: string, file: File) => {
    const url = await uploadFile(file, 'promotions');
    updatePromotion(id, 'src', url);
  };

  // Videos
  const addVideoUrl = () => {
    const newVideo: Video = {
      id: generateId(),
      title: 'Nouvelle vidéo',
      description: 'Description de la vidéo',
      url: 'https://www.facebook.com/share/r/...',
      thumbnail: '/images/gallery-3.jpg',
      type: 'url',
    };
    setEdited((prev) => ({ ...prev, videos: [...prev.videos, newVideo] }));
  };

  const addVideoFile = async (file: File) => {
    if (file.size > MAX_VIDEO_SIZE) {
      setError(`La vidéo dépasse la limite de 100 Mo (${formatBytes(file.size)}).`);
      return;
    }
    setSaving(true);
    const url = await uploadFile(file, 'videos');
    const newVideo: Video = {
      id: generateId(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: 'Vidéo uploadée',
      url,
      thumbnail: '/images/gallery-3.jpg',
      type: 'file',
    };
    setEdited((prev) => ({ ...prev, videos: [...prev.videos, newVideo] }));
    setSaving(false);
    setError('');
  };

  const updateVideo = (id: string, field: keyof Video, value: string) => {
    setEdited((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));
  };

  const removeVideo = (id: string) => {
    setEdited((prev) => ({ ...prev, videos: prev.videos.filter((v) => v.id !== id) }));
  };

  const handleVideoThumbnail = async (id: string, file: File) => {
    const url = await uploadFile(file, 'thumbnails');
    updateVideo(id, 'thumbnail', url);
  };

  // Testimonials
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: generateId(),
      name: 'Nouvelle cliente',
      role: 'Cliente',
      text: 'Mon témoignage...',
      rating: 5,
      image: '',
    };
    setEdited((prev) => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
  };

  const handleTestimonialImage = async (id: string, file: File) => {
    const url = await uploadFile(file, 'testimonials');
    updateTestimonial(id, 'image', url);
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setEdited((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  };

  const removeTestimonial = (id: string) => {
    setEdited((prev) => ({ ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) }));
  };

  const handleHeroImage = async (file: File) => {
    const url = await uploadFile(file, 'hero');
    updateHero('backgroundImage', url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f3d77b] to-[#a6852b] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#0a0a0a]" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Espace administrateur</h1>
            <p className="text-white/60 mt-2">Entrez le code d'accès sécurisé</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code d'accès"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-gold py-4 rounded-xl font-semibold text-base"
            >
              Accéder au tableau de bord
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 flex items-center justify-center gap-2 text-white/60 hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f3d77b] to-[#a6852b] flex items-center justify-center">
                <span className="font-display font-bold text-[#0a0a0a]">MK</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl">Administration</h1>
                <p className="text-[#d4af37] text-xs">Marleine Koula Hair</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`hidden md:flex items-center gap-2 text-sm px-4 py-2 rounded-full ${syncMethod !== 'local' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                <span className={`w-2 h-2 rounded-full ${syncMethod !== 'local' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                {syncMethod === 'firebase' && 'Synchronisation Firebase active'}
                {syncMethod === 'github' && 'Synchronisation GitHub active'}
                {syncMethod === 'local' && 'Mode local (non synchronisé)'}
              </div>
              {message && (
                <div className="hidden md:flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  {message}
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Voir le site
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-gold px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="p-2 rounded-full border border-white/20 hover:border-red-400 hover:text-red-400 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'Général', icon: Home },
                { id: 'services', label: 'Prestations', icon: Sparkles },
                { id: 'models', label: 'Modèles', icon: ImageIcon },
                { id: 'gallery', label: 'Galerie', icon: Camera },
                { id: 'promotions', label: 'Promotions', icon: Percent },
                { id: 'videos', label: 'Vidéos', icon: VideoIcon },
                { id: 'testimonials', label: 'Témoignages', icon: MessageSquare },
                { id: 'contact', label: 'Contact', icon: Phone },
                { id: 'security', label: 'Sécurité', icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#d4af37] text-[#0a0a0a] font-semibold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-sm text-white/60">
                {syncMethod !== 'local'
                  ? 'Les modifications sont synchronisées en ligne et visibles par tous les visiteurs.'
                  : 'Mode local : les modifications ne sont visibles que sur ce navigateur. Configurez Firebase ou GitHub pour synchroniser.'}
              </p>
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Exporter la sauvegarde
              </button>
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm cursor-pointer">
                <Upload className="w-4 h-4" /> Importer une sauvegarde
                <input type="file" accept="application/json" className="hidden" onChange={importData} />
              </label>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {message && (
              <div className="md:hidden flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-4 py-3 rounded-xl mb-6">
                <CheckCircle className="w-4 h-4" />
                {message}
              </div>
            )}

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold">Paramètres généraux</h2>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Titre principal</label>
                    <input
                      type="text"
                      value={edited.hero.title}
                      onChange={(e) => updateHero('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Sous-titre</label>
                    <input
                      type="text"
                      value={edited.hero.subtitle}
                      onChange={(e) => updateHero('subtitle', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                    <textarea
                      value={edited.hero.description}
                      onChange={(e) => updateHero('description', e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Image de bannière</label>
                    <div className="flex items-center gap-4">
                      <img
                        src={edited.hero.backgroundImage}
                        alt="Bannière"
                        className="w-32 h-20 object-cover rounded-xl border border-white/10"
                      />
                      <label className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">
                        Changer l'image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleHeroImage(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Prestations</h2>
                  <button onClick={addService} className="btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>

                <div className="space-y-4">
                  {edited.services.map((service) => (
                    <div key={service.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <img src={service.image} alt="" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                        <div className="flex-1 grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Titre</label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => updateService(service.id, 'title', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Icône</label>
                            <select
                              value={service.icon}
                              onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            >
                              {[
                                { value: 'Sparkles', label: 'Éclat' },
                                { value: 'Crown', label: 'Couronne' },
                                { value: 'Heart', label: 'Cœur' },
                                { value: 'Scissors', label: 'Ciseaux' },
                                { value: 'Star', label: 'Étoile' },
                                { value: 'Sun', label: 'Soleil' },
                                { value: 'Gem', label: 'Diamant' },
                                { value: 'Flower', label: 'Fleur' },
                                { value: 'Brush', label: 'Brosse' },
                                { value: 'HandHeart', label: 'Soin' },
                                { value: 'Award', label: 'Récompense' },
                              ].map((icon) => (
                                <option key={icon.value} value={icon.value} className="bg-[#0a0a0a]">{icon.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-white/50 mb-1">Description</label>
                            <textarea
                              value={service.description}
                              onChange={(e) => updateService(service.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="cursor-pointer p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleServiceImage(service.id, e.target.files[0])}
                            />
                          </label>
                          <button
                            onClick={() => removeService(service.id)}
                            className="p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Models Tab */}
            {activeTab === 'models' && (
              <PhotoManager
                title="Modèles de coiffures"
                description="Photos d'inspiration et modèles proposés au salon."
                images={edited.models}
                onAdd={addModel}
                onUpdate={updateModel}
                onRemove={removeModel}
                onImageUpload={handleModelImage}
              />
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <PhotoManager
                title="Galerie photos"
                description="Photos réalisées sur vos clientes."
                images={edited.gallery}
                onAdd={addGalleryImage}
                onUpdate={updateGalleryImage}
                onRemove={removeGalleryImage}
                onImageUpload={handleGalleryImage}
              />
            )}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && (
              <PhotoManager
                title="Promotions & Actions"
                description="Offres spéciales et promotions du moment."
                images={edited.promotions}
                onAdd={addPromotion}
                onUpdate={updatePromotion}
                onRemove={removePromotion}
                onImageUpload={handlePromotionImage}
              />
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Vidéos</h2>
                  <div className="flex gap-2">
                    <label className="cursor-pointer btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Upload vidéo
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && addVideoFile(e.target.files[0])}
                      />
                    </label>
                    <button onClick={addVideoUrl} className="px-4 py-2 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-colors text-sm font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Lien
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <p className="text-white/50 text-sm">
                  Limite par vidéo uploadée : <span className="text-[#d4af37] font-semibold">100 Mo</span>. Les vidéos par lien (Facebook, YouTube...) n'ont pas de limite.
                </p>

                <div className="space-y-4">
                  {edited.videos.map((video) => (
                    <div key={video.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative md:w-48 shrink-0">
                          <img src={video.thumbnail} alt="" className="w-full h-28 object-cover rounded-xl border border-white/10" />
                          <label className="absolute bottom-2 right-2 cursor-pointer p-1.5 rounded-lg bg-black/60 hover:bg-black/80 transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleVideoThumbnail(video.id, e.target.files[0])}
                            />
                          </label>
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${video.type === 'file' ? 'bg-green-400/20 text-green-400' : 'bg-[#d4af37]/20 text-[#d4af37]'}`}>
                            {video.type === 'file' ? 'Fichier' : 'Lien'}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Titre</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Description</label>
                            <input
                              type="text"
                              value={video.description}
                              onChange={(e) => updateVideo(video.id, 'description', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">
                              {video.type === 'file' ? 'Vidéo stockée' : 'URL de la vidéo'}
                            </label>
                            {video.type === 'file' ? (
                              <p className="text-sm text-white/40 truncate">{video.url.slice(0, 60)}...</p>
                            ) : (
                              <input
                                type="url"
                                value={video.url}
                                onChange={(e) => updateVideo(video.id, 'url', e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                              />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeVideo(video.id)}
                          className="self-start p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Témoignages</h2>
                  <button onClick={addTestimonial} className="btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>

                <div className="space-y-4">
                  {edited.testimonials.map((t) => (
                    <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="md:w-40 shrink-0">
                          <label className="block text-xs text-white/50 mb-2">Photo</label>
                          <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                            {t.image ? (
                              <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/30">
                                <User className="w-10 h-10" />
                              </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="text-white text-xs font-medium">
                                {t.image ? 'Changer' : 'Ajouter'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleTestimonialImage(t.id, e.target.files[0])}
                              />
                            </label>
                          </div>
                          {t.image && (
                            <button
                              onClick={() => updateTestimonial(t.id, 'image', '')}
                              className="w-full mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Retirer la photo
                            </button>
                          )}
                        </div>
                        <div className="flex-1 grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Nom</label>
                            <input
                              type="text"
                              value={t.name}
                              onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Statut</label>
                            <input
                              type="text"
                              value={t.role}
                              onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-white/50 mb-1">Témoignage</label>
                            <textarea
                              value={t.text}
                              onChange={(e) => updateTestimonial(t.id, 'text', e.target.value)}
                              rows={3}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">Note (1-5)</label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={t.rating}
                              onChange={(e) => updateTestimonial(t.id, 'rating', parseInt(e.target.value) || 1)}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeTestimonial(t.id)}
                          className="px-3 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold">Informations de contact</h2>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#d4af37]" /> Téléphone principal
                      </label>
                      <input
                        type="text"
                        value={edited.contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#d4af37]" /> Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        value={edited.contact.phone2}
                        onChange={(e) => updateContact('phone2', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#d4af37]" /> WhatsApp
                      </label>
                      <input
                        type="text"
                        value={edited.contact.whatsapp}
                        onChange={(e) => updateContact('whatsapp', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#d4af37]" /> Adresse
                      </label>
                      <input
                        type="text"
                        value={edited.contact.address}
                        onChange={(e) => updateContact('address', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" /> Horaires
                    </label>
                    <textarea
                      value={edited.contact.hours}
                      onChange={(e) => updateContact('hours', e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Lien Google Maps</label>
                    <input
                      type="url"
                      value={edited.contact.mapLink}
                      onChange={(e) => updateContact('mapLink', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <h3 className="font-semibold mb-4">Réseaux sociaux</h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-[#d4af37]" /> Facebook
                        </label>
                        <input
                          type="url"
                          value={edited.social.facebook}
                          onChange={(e) => updateSocial('facebook', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-[#d4af37]" /> Instagram
                        </label>
                        <input
                          type="url"
                          value={edited.social.instagram}
                          onChange={(e) => updateSocial('instagram', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <SecurityTab
                currentCode={edited.adminCode}
                onChange={(newCode) => setEdited((prev) => ({ ...prev, adminCode: newCode }))}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ currentCode, onChange }: { currentCode: string; onChange: (code: string) => void }) {
  const [currentInput, setCurrentInput] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showCodes, setShowCodes] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (currentInput !== currentCode) {
      setError('Code actuel incorrect.');
      return;
    }

    if (newCode.length < 6) {
      setError('Le nouveau code doit faire au moins 6 chiffres.');
      return;
    }

    if (newCode !== confirmCode) {
      setError('Les nouveaux codes ne correspondent pas.');
      return;
    }

    if (!/^\d+$/.test(newCode)) {
      setError('Le code doit contenir uniquement des chiffres.');
      return;
    }

    onChange(newCode);
    setSuccess('Code d\'accès modifié avec succès !');
    setCurrentInput('');
    setNewCode('');
    setConfirmCode('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-3">
          <Shield className="w-7 h-7 text-[#d4af37]" />
          Sécurité
        </h2>
        <p className="text-white/60 mt-2">Modifiez le code d'accès de l'espace administrateur.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-white/50">Code actuel</p>
            <p className="font-mono text-xl text-white tracking-widest">{showCodes ? currentCode : '•••••••••'}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCodes(!showCodes)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
          >
            {showCodes ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Code actuel</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type={showCodes ? 'text' : 'password'}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Entrez le code actuel"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Nouveau code</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type={showCodes ? 'text' : 'password'}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Minimum 6 chiffres"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Confirmer le nouveau code</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type={showCodes ? 'text' : 'password'}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="Répétez le nouveau code"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-gold py-3 rounded-xl font-semibold"
          >
            Changer le code d'accès
          </button>
        </form>
      </div>

      <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 max-w-xl">
        <p className="text-yellow-400 text-sm">
          <strong>Important :</strong> Après avoir changé le code, cliquez sur le bouton <strong>"Enregistrer"</strong> en haut de la page pour sauvegarder la modification.
        </p>
      </div>
    </div>
  );
}

interface PhotoManagerProps {
  title: string;
  description: string;
  images: GalleryImage[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof GalleryImage, value: string) => void;
  onRemove: (id: string) => void;
  onImageUpload: (id: string, file: File) => void;
}

function PhotoManager({ title, description, images, onAdd, onUpdate, onRemove, onImageUpload }: PhotoManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <button onClick={onAdd} className="btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <p className="text-white/60 text-sm mt-1">{description}</p>
      </div>

      {images.length === 0 ? (
        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Aucune photo pour le moment.</p>
          <button onClick={onAdd} className="mt-4 text-[#d4af37] hover:text-[#f3d77b] text-sm font-medium">
            Ajouter une photo
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <img src={image.src} alt="" className="w-full h-40 object-cover rounded-xl border border-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Titre</label>
                  <input
                    type="text"
                    value={image.title}
                    onChange={(e) => onUpdate(image.id, 'title', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={image.category}
                    onChange={(e) => onUpdate(image.id, 'category', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm text-center">
                  Changer photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onImageUpload(image.id, e.target.files[0])}
                  />
                </label>
                <button
                  onClick={() => onRemove(image.id)}
                  className="px-3 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

