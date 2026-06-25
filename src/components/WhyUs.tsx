import { motion } from 'framer-motion';
import { CheckCircle2, Star, Users, Leaf, Clock, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: Users,
    title: 'Coiffeuses expérimentées',
    description: 'Une équipe passionnée et formée aux dernières techniques de coiffure.',
  },
  {
    icon: Star,
    title: 'Produits de qualité',
    description: 'Nous utilisons des produits soigneusement sélectionnés pour votre cuir chevelu.',
  },
  {
    icon: Clock,
    title: 'Service rapide et soigné',
    description: 'Respect des horaires et attention portée à chaque détail de votre coiffure.',
  },
  {
    icon: HeartHandshake,
    title: 'Conseils personnalisés',
    description: 'Des recommandations adaptées à votre type de cheveux et à votre style de vie.',
  },
  {
    icon: Leaf,
    title: 'Soins protecteurs',
    description: 'Des coiffures qui préservent la santé et la croissance de vos cheveux.',
  },
  {
    icon: CheckCircle2,
    title: 'Accueil chaleureux',
    description: 'Une ambiance conviviale pour vous sentir bien dès votre arrivée au salon.',
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-[0.2em]">Pourquoi nous choisir</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
              L'excellence à la portée de toutes
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Chez Marleine Koula Hair, chaque cliente est unique. Nous mettons notre expertise au service de votre beauté 
              pour vous offrir une expérience de coiffure inoubliable dans un cadre chaleureux à Yopougon.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { number: '500+', label: 'Clientes satisfaites' },
                { number: '6+', label: 'Années d\'expérience' },
                { number: '4', label: 'Coiffeuses expertes' },
                { number: '100%', label: 'Passion & soin' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="font-display text-3xl font-bold text-[#d4af37]">{stat.number}</p>
                  <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#f3d77b] to-[#a6852b] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#0a0a0a]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{reason.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{reason.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
