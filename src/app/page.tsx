'use client';
// app/page.tsx

import Navbar from './components/homepage/Navbar';
import Hero from './components/homepage/Hero';
import Features from './components/homepage/Features';
import Testimonials from './components/homepage/Testimonials';
import Footer from './components/homepage/Footer';
import SubmittedRatings from './components/homepage/SubmittedRatings';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
      // Scroll to top on page load
      window.scrollTo(0, 0);
    }, []);
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
