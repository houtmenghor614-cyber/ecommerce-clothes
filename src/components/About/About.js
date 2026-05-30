import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Menghor Store</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your premier destination for premium fashion and accessories
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2026, Menghor STORE was born from a passion for fashion and a desire to bring 
                the latest trends to fashion-forward individuals across Cambodia.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                What started as a small boutique has grown into a premier online destination for 
                quality clothing, accessories, and footwear. We carefully curate our collection to 
                ensure every piece meets our standards for style, quality, and value.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Menghor STORE serves thousands of satisfied customers, offering a seamless 
                shopping experience with fast delivery and exceptional customer service.
              </p>
            </div>
            <div className="h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3" 
                alt="Our Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default About;