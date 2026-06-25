import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Promotions from '../components/Promotions';
import WhyUs from '../components/WhyUs';
import Models from '../components/Models';
import Videos from '../components/Videos';
import Testimonials from '../components/Testimonials';
import BookingCTA from '../components/BookingCTA';
import MapContact from '../components/MapContact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Promotions />
        <WhyUs />
        <Models />
        <Videos />
        <Testimonials />
        <BookingCTA />
        <MapContact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
