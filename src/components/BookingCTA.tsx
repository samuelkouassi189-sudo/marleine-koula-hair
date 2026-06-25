import { motion } from 'framer-motion';
import { CalendarCheck, Phone, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function BookingCTA() {
  const { data } = useSite();
  const { contact } = data;
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20prendre%20rendez-vous%20pour%20une%20coiffure.`;

  return (
    <section className="py-24 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <CalendarCheck className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prenez rendez-vous dès aujourd'hui
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Ne laissez pas votre prochaine coiffure au hasard. Appelez-nous ou contactez-nous directement sur WhatsApp pour réserver votre place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Réserver sur WhatsApp
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="btn-outline-gold px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {contact.phone}
            </a>
          </div>

          <p className="text-white/50 text-sm">
            🚨 Livraison & expédition possible | 📞 {contact.phone} | 💬 WhatsApp : {contact.whatsapp}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
