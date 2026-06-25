import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MapPin, Settings } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Prestations', href: '#prestations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Vidéos', href: '#videos' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { data } = useSite();
  const { contact } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

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
    setIsOpen(false);
  };

  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Bonjour%20Marleine%20Koula%20Hair%2C%20je%20souhaite%20prendre%20rendez-vous%20pour%20une%20coiffure.`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#accueil" onClick={(e) => scrollToSection(e, '#accueil')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f3d77b] via-[#d4af37] to-[#a6852b] flex items-center justify-center shadow-lg">
              <span className="font-display font-bold text-[#0a0a0a] text-lg">MK</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-white text-lg leading-tight group-hover:text-[#d4af37] transition-colors">
                Marleine Koula Hair
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Salon de coiffure</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-white/90 hover:text-[#d4af37] transition-colors uppercase tracking-wider cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA & Contact */}
          <div className="hidden lg:flex items-center gap-4">
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white/90 hover:text-[#d4af37] transition-colors text-sm">
              <Phone className="w-4 h-4" />
              <span>{contact.phone}</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              Réserver
            </a>
            <a
              href="/admin"
              className="p-2 rounded-full border border-white/20 text-white/70 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
              title="Espace administrateur"
            >
              <Settings className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-[#d4af37] transition-colors"
            aria-label="Ouvrir le menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0a]/98 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block text-white/90 hover:text-[#d4af37] transition-colors text-lg font-medium py-2 border-b border-white/5 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-white/90">
                  <Phone className="w-5 h-5 text-[#d4af37]" />
                  <span>{contact.phone}</span>
                </a>
                <div className="flex items-center gap-3 text-white/90">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  <span>{contact.address}</span>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full block text-center py-3 rounded-full font-semibold mt-4"
                  onClick={handleLinkClick}
                >
                  Prendre rendez-vous
                </a>
                <a
                  href="/admin"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white/70 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                  onClick={handleLinkClick}
                >
                  <Settings className="w-4 h-4" />
                  Espace administrateur
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
