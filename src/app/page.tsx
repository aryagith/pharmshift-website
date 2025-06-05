// app/page.tsx
import Navbar from './components/HomePage/Navbar';
import Hero from './components/HomePage/Hero';
import Features from './components/HomePage/Features';
import Testimonials from './components/HomePage/Testimonials';
import Footer from './components/HomePage/Footer';
import SubmittedRatings from './components/HomePage/SubmittedRatings';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SubmittedRatings />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}
