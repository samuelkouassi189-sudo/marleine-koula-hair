import { motion } from 'framer-motion';
import { Percent, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Promotions() {
  const { data } = useSite();
  const { promotions, contact } = data;
  const activePromotions = promotions.filter((p) => p.active);
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20profiter%20d'une%20promotion.`;

  return (
    <section id="promotions" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-[0.2em]">Offres spéciales</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Nos Promotions
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#f3d77b] mx-auto mb-6" />
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Profitez de nos offres du moment pour vous faire belle à prix réduit.
          </p>
        </motion.div>

        {activePromotions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">Aucune promotion en cours.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  {promo.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#d4af37] text-[#0a0a0a] text-sm font-bold shadow-lg">
                      {promo.badge}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl font-bold text-white">{promo.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 mb-5 leading-relaxed">{promo.description}</p>
                  <div className="flex items-end gap-3 mb-6">
                    {promo.oldPrice && (
                      <span className="text-white/40 line-through text-lg">{promo.oldPrice}</span>
                    )}
                    <span className="text-[#d4af37] font-display text-3xl font-bold">{promo.newPrice}</span>
                  </div>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-gold py-3 rounded-full font-semibold flex items-center justify-center gap-2"
                  >
                    En profiter <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
