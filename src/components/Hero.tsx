import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Phone, Clock, Award } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Hero() {
  const { data } = useSite();
  const { hero, contact } = data;
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20prendre%20rendez-vous%20pour%20une%20coiffure.`;
  const phoneLink = `tel:${contact.phone.replace(/\s/g, '')}`;

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={hero.backgroundImage}
          alt="Bannière du salon"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-[#f3d77b] text-sm font-medium">{hero.subtitle}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              {hero.title.split('référence').length > 1 ? (
                <>
                  {hero.title.split('référence')[0]}
                  <span className="text-gold-gradient">référence</span>
                  {hero.title.split('référence')[1]}
                </>
              ) : (
                hero.title
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </a>
              <a
                href={phoneLink}
                className="btn-outline-gold px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {contact.phone}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-white/70 text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Service rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>Coiffeuses expérimentées</span>
              </div>
            </motion.div>
          </div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-3xl p-8 max-w-md ml-auto">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/uploads/upload_1.jpeg"
                  alt="Logo Marleine Koula Hair"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]"
                />
                <div>
                  <p className="font-display font-bold text-white text-xl">Marleine Koula Hair</p>
                  <p className="text-[#d4af37] text-sm">Coiffure &amp; Soins capillaires</p>
                </div>
              </div>
              <div className="space-y-4 text-white/80">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#d4af37]">📍</span>
                  </div>
                  <p>{contact.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#d4af37]">📞</span>
                  </div>
                  <p>{contact.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#d4af37]">💬</span>
                  </div>
                  <p>WhatsApp : {contact.whatsapp}</p>
                </div>
              </div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full block text-center py-3 rounded-full font-semibold mt-6"
              >
                <span className="flex items-center justify-center gap-2">
                  Réserver sur WhatsApp <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs uppercase tracking-widest">Découvrir</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
          />
        </div>
      </motion.div>
    </section>
  );
}
