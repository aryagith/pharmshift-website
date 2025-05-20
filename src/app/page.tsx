// app/page.tsx
import Navbar from './components/homepage/Navbar';
import Hero from './components/homepage/Hero';
import Features from './components/homepage/Features';
import Testimonials from './components/homepage/Testimonials';
import Footer from './components/homepage/Footer';
import SubmittedRatings from './components/homepage/SubmittedRatings';

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
