import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Testimonials() {
  const { data } = useSite();
  const { testimonials } = data;

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
          <span className="text-[#a6852b] font-semibold text-sm uppercase tracking-[0.2em]">Témoignages</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4">
            Ce que disent nos clientes
          </h2>
          <div className="section-divider mb-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#d4af37]/10 relative"
            >
              {testimonial.image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              <div className="p-8">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-[#d4af37]/20" />
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
                  ))}
                </div>
                <p className="text-[#6b6b6b] mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f3d77b] to-[#a6852b] flex items-center justify-center text-[#0a0a0a] font-display font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#0a0a0a]">{testimonial.name}</p>
                    <p className="text-sm text-[#6b6b6b]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
