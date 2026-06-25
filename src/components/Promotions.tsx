import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Percent } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Promotions() {
  const { data } = useSite();
  const { promotions } = data;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!promotions.length) return null;

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % promotions.length);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + promotions.length) % promotions.length);
  };

  return (
    <section className="py-24 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#a6852b] font-semibold text-sm uppercase tracking-[0.2em]">Offres spéciales</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4">
            Promotions & Actions
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[#6b6b6b] max-w-2xl mx-auto text-lg">
            Profitez de nos offres du moment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {promotions.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer img-zoom shadow-lg"
            >
              <img src={image.src} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Percent className="w-3 h-3" /> Promo
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[#d4af37] text-xs font-semibold uppercase tracking-wider">{image.category}</span>
                <h3 className="font-display text-white text-lg font-bold">{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
              <img src={promotions[selectedImage].src} alt={promotions[selectedImage].title} className="w-full max-h-[80vh] object-contain rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent rounded-b-lg">
                <span className="text-[#d4af37] text-sm font-semibold uppercase tracking-wider">{promotions[selectedImage].category}</span>
                <h3 className="font-display text-white text-2xl font-bold mt-1">{promotions[selectedImage].title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
