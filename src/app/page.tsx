// app/page.tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SubmittedRatings from './components/SubmittedRatings';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SubmittedRatings />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}
