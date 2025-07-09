'use client';
// app/page.tsx

import Navbar from './components/home-page/Navbar';
import Hero from './components/home-page/Hero';
import Features from './components/home-page/Features';
import Testimonials from './components/home-page/Testimonials';
import Footer from './components/home-page/Footer';
import SubmittedRatings from './components/home-page/SubmittedRatings';
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
