import { motion } from 'framer-motion';
import { Sparkles, Crown, Heart, Scissors, Star, Sun, Gem, Flower2, Brush, HandHeart, Award } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Crown,
  Heart,
  Scissors,
  Star,
  Sun,
  Gem,
  Flower: Flower2,
  Brush,
  HandHeart,
  Award,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services() {
  const { data } = useSite();
  const { services } = data;

  return (
    <section id="prestations" className="py-24 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#a6852b] font-semibold text-sm uppercase tracking-[0.2em]">Nos expertises</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4">
            Nos Prestations
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[#6b6b6b] max-w-2xl mx-auto text-lg">
            Des prestations de coiffure sur mesure, réalisées avec passion et professionnalisme pour révéler votre beauté naturelle.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg card-lift"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f3d77b] to-[#a6852b] flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-[#0a0a0a]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0a0a0a] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#d4af37] text-lg">✨</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
