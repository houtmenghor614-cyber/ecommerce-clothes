import React from 'react';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import About from '../About/About';
import Contact from '../Contact/Contact';

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <FeaturedProducts />
      <Contact/>
    </div>
  );
};

export default Home;