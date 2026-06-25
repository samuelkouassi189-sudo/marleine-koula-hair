import { Facebook, Instagram, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data } = useSite();
  const { contact, social } = data;
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20prendre%20rendez-vous%20pour%20une%20coiffure.`;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f3d77b] via-[#d4af37] to-[#a6852b] flex items-center justify-center">
                <span className="font-display font-bold text-[#0a0a0a] text-xl">MK</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl">Marleine Koula Hair</p>
                <p className="text-[#d4af37] text-xs uppercase tracking-widest">Salon de coiffure</p>
              </div>
            </div>
            <p className="text-white/60 mb-6 max-w-md leading-relaxed">
              Votre salon de coiffure de référence à Yopougon. Nous sublimons votre beauté avec des coiffures modernes, 
              élégantes et adaptées à toutes les occasions.
            </p>
            <div className="flex gap-4">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#d4af37] flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white group-hover:text-[#0a0a0a]" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#d4af37] flex items-center justify-center transition-colors group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:text-[#0a0a0a]" />
              </a>
              {social.instagram && social.instagram !== '#' && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#d4af37] flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white group-hover:text-[#0a0a0a]" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-[#d4af37]">Liens rapides</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', href: '#accueil' },
                { label: 'Nos prestations', href: '#prestations' },
                { label: 'Promotions', href: '#promotions' },
                { label: 'Modèles', href: '#modeles' },
                { label: 'Vidéos', href: '#videos' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-white/60 hover:text-[#d4af37] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-[#d4af37]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-[#d4af37] transition-colors">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <MessageCircle className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">
                  {contact.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {currentYear} Marleine Koula Hair. Tous droits réservés.
          </p>
          <p className="text-white/50 text-sm">
            Fait avec passion à Yopougon ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
