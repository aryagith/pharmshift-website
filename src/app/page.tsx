'use client';
// app/page.tsx

import Navbar from './components/HomePage/Navbar';
import Hero from './components/HomePage/Hero';
import Features from './components/HomePage/Features';
import Testimonials from './components/HomePage/Testimonials';
import Footer from './components/HomePage/Footer';
import SubmittedRatings from './components/HomePage/SubmittedRatings';
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
