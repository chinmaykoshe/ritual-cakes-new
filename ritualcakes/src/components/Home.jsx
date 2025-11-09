import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { assets } from "../../assets/assets";
import Card from "../../components/Card";
import DesignCard from "../../components/DesignCard";
import { fadeIn } from "../../variants";

const Home = () => {
  // Observe hero once only
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <motion.div
      ref={heroRef}
      className="py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: heroInView ? 1 : 1 }} // stable final state
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Hero Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-8 md:gap-16"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Left Section */}
        <motion.div
          className="text-left max-w-lg space-y-5 md:space-y-6"
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            From Our Oven to Your Heart.
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-600"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Freshly baked, handcrafted, and made with love — every cake from
            Ritual Cakes is a celebration in itself.
          </motion.p>

          <motion.a
            href="#products"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full text-lg font-medium hover:bg-pink-700 transition-transform duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Shop Now
          </motion.a>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex justify-center items-center w-full md:w-1/2"
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          style={{ willChange: "transform, opacity" }}
        >
          <motion.img
            src={assets.blueberryCheesecake}
            alt="Chocolate Cake"
            loading="eager"
            width="800"
            height="600"
            className="w-full max-w-[500px] object-cover rounded-xl shadow-md ml-5 md:ml-20 mr-5 md:mr-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        id="products"
        className="mt-24 max-w-7xl mx-auto text-center"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          Our Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          <Card orderID="chocolate" />
          <Card orderID="fruit" />
          <Card orderID="custom" />
        </div>
      </motion.div>

      {/* Baking Process Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-10 mt-28 max-w-7xl mx-auto px-4 md:px-8"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="md:w-1/2"
          style={{ willChange: "transform, opacity" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Baking Process
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            Every cake we bake is a blend of art and science. From choosing the
            finest ingredients to ensuring the perfect rise — we craft each
            treat with care and precision.
          </p>
          <motion.a
            href="#designs"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full text-lg font-medium hover:bg-pink-700 transition-transform duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            View More
          </motion.a>
        </motion.div>

        <motion.div
          className="md:w-1/2 flex justify-center"
          variants={fadeIn("left", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/baking process.png"
            alt="Baking Process"
            width="700"
            height="500"
            loading="lazy"
            className="w-full max-w-[450px] object-cover rounded-lg shadow-md"
          />
        </motion.div>
      </motion.div>

      {/* Cake Designs Section */}
      <motion.div
        id="designs"
        className="mt-24 max-w-7xl mx-auto text-center px-4"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          Stunning Cake Designs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          <DesignCard />
          <DesignCard />
          <DesignCard />
        </div>
      </motion.div>

      {/* Embedded Video */}
      <motion.div
        className="mt-28 max-w-6xl mx-auto px-4"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-xl shadow-lg w-full aspect-video">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/aqyO0RzBXhY"
            title="Cake Baking Process"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;