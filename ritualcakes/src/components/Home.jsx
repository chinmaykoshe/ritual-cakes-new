import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { NavLink } from 'react-router-dom';
import Card from './Card';
import DesignCard from './DesignCard';
import { designnames } from '../designs/designassets';
import { motion } from 'framer-motion'; // Import framer-motion
import { useInView } from 'react-intersection-observer'; // Import react-intersection-observer
import '../App.css'; // Import the custom CSS file

// Get the design keys (in this case design1, design2, etc.)
const designKeys = Object.keys(designnames);

function Home() {
  const [randomDesigns, setRandomDesigns] = useState([]);

  useEffect(() => {
    // Function to get random designs
    const getRandomDesigns = () => {
      if (!designnames || typeof designnames !== 'object') return [];

      // Get all design keys
      const designKeys = Object.keys(designnames);

      // Shuffle the array and select the first 4 designs
      const shuffledKeys = designKeys.sort(() => Math.random() - 0.5).slice(0, 4);
      setRandomDesigns(shuffledKeys);
    };

    getRandomDesigns();
  }, [designnames]); // Re-run the effect if `designnames` changes

  const reviews = [
    { id: 1, name: 'Alice', text: 'Amazing cakes! Highly recommend.' },
    { id: 2, name: 'Bob', text: 'Fresh and delicious, every single time.' },
    { id: 3, name: 'Charlie', text: 'Great service and even better cakes.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <motion.div 
        className="py-8 px-4 overflow-hidden"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 lg:ml-16 md:mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat text-brown"
              initial={{ x: -100 }} 
              animate={{ x: 0 }} 
              transition={{ duration: 0.3 }}
            >
              From Our Oven to Your Heart.
            </motion.h1>
            <motion.p 
              className="text-m lg:text-2xl mt-4 text-gray-500 italic font-montserrat"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              We are a company dedicated to the preparation of cakes, providing our customers with a product always fresh from the oven.
            </motion.p>
            <NavLink to="/cakes">
              <motion.button 
                className="custom-btn btn-11 w-full lg:w-[500px] mt-6 px-16 py-4 bg-darkcustombg text-darkcustomGray rounded-lg hover:bg-darkcustombg2 border-4 border-orange-300 bg-opacity-50"
                whileHover={{ scale: 1 }} 
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span>DISCOVER MENU</span>
                <span className="text-xl">→</span>
              </motion.button>
            </NavLink>
          </div>
          <NavLink to="/cakes">
            <motion.div 
              className="flex-1 flex justify-center mt-8 md:mt-0"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1, duration: 0.3 }}
            >
              <img
                src={assets.blueberryCheesecake}
                alt="Chocolate Cake"
                className="w-full max-w-[500px] object-cover rounded-xl shadow-md ml-5 md:ml-20 mr-5 md:mr-20"
              />
            </motion.div>
          </NavLink>
        </div>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Specials Section */}
      <motion.div 
        className="signature-section py-8 lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-center font-montserrat text-brown">Our Specials</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2, duration: 0.3 }}
          >
            <Card orderID="rituals5" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2.2, duration: 0.3 }}
          >
            <Card orderID="rituals6" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2.4, duration: 0.3 }}
          >
            <Card orderID="rituals1" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2.6, duration: 0.3 }}
          >
            <Card orderID="rituals10" />
          </motion.div>
        </div>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Categories Section */}
      <motion.div 
        className="signature-section py-8 lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 3, duration: 0.3 }}
      >
        <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-center font-montserrat text-brown">Explore Our Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {randomDesigns.length > 0 ? (
            randomDesigns.map((designKey) => (
              <motion.div 
                key={designKey} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 3.2, duration: 0.3 }}
              >
                <DesignCard
                  designnames={designnames}  // Pass the design data
                  designKey={designKey}      // Pass the individual design key
                />
              </motion.div>
            ))
          ) : (
            <div>No designs available</div>
          )}
        </div>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Customer Reviews Section */}
      <motion.div 
        className="py-8 px-4 lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 3.5, duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-brown">What Our Customers Say</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 relative"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 3.8, duration: 0.3 }}
            >
              <h1 className='text-8xl my-[-48px]'>&ldquo;</h1>
              <div className="flex items-center my-4">
                <span className="md:text-xl text-lg font-semibold text-brown">{review.name}</span>
                <div className="text-yellow-500 text-m md:text-lg ml-2">★★★★★</div>
              </div>
              <p className="text-gray-700 md:text-lg text-sm italic">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Baking Process Section */}
      <motion.div 
        className="py-8 px-4 lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 4, duration: 0.3 }}
      >
        <h2 className="text-4xl font-bold text-center text-brown">How We Bake</h2>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <img
            src="/baking process.png"
            alt="Baking Process"
            className="w-full md:w-1/2 rounded-lg shadow-md"
          />
          <p className="text-lg md:ml-8 mt-4 md:mt-0 text-gray-600">
            Our cakes are made using fresh ingredients, precision, and love. From selecting the finest ingredients to delivering perfectly baked cakes, we ensure every step is done with perfection.
          </p>
        </div>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Subscription Section */}
      <motion.div 
        className="py-8 px-4 text-darkcustomGray text-center lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 4.5, duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Order Your Favorite Cake?</h2>
        <p className="text-lg">
          Sign up now to customize and order your delicious cake online with just a few clicks!
        </p>
        <motion.button
  type="button"
  className="custom-btn btn-11 w-full lg:w-[500px] mt-6 px-16 py-4 bg-darkcustombg text-darkcustomGray rounded-lg hover:bg-darkcustombg2 border-4 border-orange-300 bg-opacity-50"
  onClick={() => window.location = '/signup'}
  whileHover={{ scale: 1 }} 
  transition={{ type: 'spring', stiffness: 300 }}
>
  <span>Sign Up to Order Now!</span>
  <span className="text-xl">→</span>
</motion.button>
      </motion.div>

      <hr className="border-2 border-brown mx-4 md:mx-20" />

      {/* Google Maps Section */}
      <motion.div 
        className="py-8 px-4 lg:mx-24 mx-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 3, duration: 0.3 }}
      >
        <h2 className="text-4xl font-bold text-center text-brown">Find Us Here</h2>
        <p className="text-lg text-center mt-4 text-gray-600">
          Visit us at our location for a closer look at our delicious cakes!
        </p>
        <div className="mt-8 flex justify-center h-[300px] lg:h-[450px]">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.2711623626733!2d72.9600834!3d18.8750479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7dbac33768917%3A0xdcaf157aff2365c!2sRitual%20Cakes!5e0!3m2!1sen!2sin!4v1736347547502!5m2!1sen!2sin"
            width="80%"
            className="rounded-lg shadow-lg"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
