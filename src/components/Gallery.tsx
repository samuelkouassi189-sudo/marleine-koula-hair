import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Gallery() {
  const { data } = useSite();
  const { gallery } = data;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % gallery.length);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length);
  };

  return (
    <section id="galerie" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-[0.2em]">Nos réalisations</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Galerie
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#f3d77b] mx-auto mb-6" />
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Photos de nos clientes réalisées au salon.
          </p>
        </motion.div>

        {gallery.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-[#d4af37]/30 mx-auto mb-4" />
            <p className="text-white/50 text-lg">La galerie est vide pour le moment.</p>
            <p className="text-white/40 text-sm mt-2">Ajoutez des photos depuis l'espace administrateur.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {gallery.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer img-zoom shadow-lg border border-white/10"
              >
                <img src={image.src} alt={image.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[#d4af37] text-xs font-semibold uppercase tracking-wider">{image.category}</span>
                  <h3 className="font-display text-white text-lg font-bold">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 p-2 text-white/80 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={gallery[selectedImage].src} alt={gallery[selectedImage].title} className="w-full max-h-[80vh] object-contain rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent rounded-b-lg">
                <span className="text-[#d4af37] text-sm font-semibold uppercase tracking-wider">{gallery[selectedImage].category}</span>
                <h3 className="font-display text-white text-2xl font-bold mt-1">{gallery[selectedImage].title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
