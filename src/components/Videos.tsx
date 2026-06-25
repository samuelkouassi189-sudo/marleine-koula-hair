import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Facebook, Film, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Videos() {
  const { data } = useSite();
  const { videos } = data;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (!videos.length) return null;

  const closeLightbox = () => setActiveVideo(null);

  return (
    <section id="videos" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-[0.2em]">Nos vidéos</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Galerie Vidéo
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#f3d77b] mx-auto mb-6" />
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Découvrez nos réalisations en vidéo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300"
            >
              <div
                className="aspect-video relative overflow-hidden cursor-pointer"
                onClick={() => video.type === 'file' ? setActiveVideo(video.url) : undefined}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/40 group-hover:bg-[#0a0a0a]/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {video.type === 'file' ? (
                    <div className="w-16 h-16 rounded-full bg-[#d4af37] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-[#0a0a0a] ml-1" />
                    </div>
                  ) : (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 rounded-full bg-[#d4af37] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Play className="w-7 h-7 text-[#0a0a0a] ml-1" />
                    </a>
                  )}
                </div>
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium ${video.type === 'file' ? 'bg-green-400/20 text-green-400' : 'bg-[#d4af37]/20 text-[#d4af37]'}`}>
                  {video.type === 'file' ? 'Vidéo' : 'Lien'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[#d4af37] text-sm mb-3">
                  {video.type === 'file' ? (
                    <>
                      <Film className="w-4 h-4" />
                      <span className="font-medium">Lire la vidéo</span>
                    </>
                  ) : (
                    <>
                      <Facebook className="w-4 h-4" />
                      <span className="font-medium">Voir sur Facebook</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                  {video.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
              {video.type === 'url' && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
