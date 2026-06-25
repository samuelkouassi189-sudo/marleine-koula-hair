import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function MapContact() {
  const { data } = useSite();
  const { contact } = data;
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20prendre%20rendez-vous%20pour%20une%20coiffure.`;

  return (
    <section id="contact" className="py-24 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#a6852b] font-semibold text-sm uppercase tracking-[0.2em]">Où nous trouver</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4">
            Contact & Localisation
          </h2>
          <div className="section-divider mb-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0a0a0a] rounded-3xl p-8 md:p-10 text-white"
          >
            <div className="flex items-center gap-4 mb-8">
              <img
                src="/uploads/upload_1.jpeg"
                alt="Logo Marleine Koula Hair"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]"
              />
              <div>
                <h3 className="font-display text-2xl font-bold">Marleine Koula Hair</h3>
                <p className="text-[#d4af37] text-sm">Salon de coiffure à Yopougon</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Adresse</p>
                  <p className="text-white/70">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Téléphone</p>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-white/70 hover:text-[#d4af37] transition-colors">{contact.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-semibold text-lg">WhatsApp</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#d4af37] transition-colors">
                    {contact.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Horaires</p>
                  {contact.hours.split('\n').map((line, i) => (
                    <p key={i} className="text-white/70">{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full block text-center py-4 rounded-full font-semibold"
            >
              Prendre rendez-vous
            </a>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#d4af37]/10 flex flex-col"
          >
            <div className="flex-1 min-h-[400px] relative">
              <iframe
                title="Localisation Marleine Koula Hair"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15888.0!2d-4.0747!3d5.352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5d0e3c3f6b%3A0x3c0c6c7e8f5a6b9c!2sYopougon%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe absolute inset-0"
              />
            </div>
            <div className="p-6 bg-white">
              <p className="text-[#6b6b6b] text-sm mb-4">
                Retrouvez facilement notre salon à Yopougon grâce à Google Maps.
              </p>
              <a
                href={contact.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold w-full block text-center py-3 rounded-full font-semibold"
              >
                Voir l'itinéraire sur Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
