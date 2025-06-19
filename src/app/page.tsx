'use client';
// app/page.tsx

import Navbar from './components/homePage-temp/Navbar';
import Hero from './components/homePage-temp/Hero';
import Features from './components/homePage-temp/Features';
import Testimonials from './components/homePage-temp/Testimonials';
import Footer from './components/homePage-temp/Footer';
import SubmittedRatings from './components/homePage-temp/SubmittedRatings';
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
