import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { assets } from "../../assets/assets";
import Card from "../../components/Card";
import DesignCard from "../../components/DesignCard";

const Home = () => {
  return (
    <div className="py-8 px-4 overflow-x-hidden bg-white">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
        {/* Left Text */}
        <motion.div
          className="text-left max-w-lg space-y-5 md:space-y-6"
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            From Our Oven to Your Heart.
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Freshly baked, handcrafted, and made with love — every cake from
            Ritual Cakes is a celebration in itself.
          </p>
          <a
            href="#products"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full text-lg font-medium hover:bg-pink-700 transition-transform duration-200"
          >
            Shop Now
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex justify-center items-center w-full md:w-1/2"
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={assets.blueberryCheesecake}
            alt="Chocolate Cake"
            className="w-full max-w-[480px] object-cover rounded-xl shadow-md"
            loading="eager"
            decoding="async"
            width="800"
            height="600"
            style={{
              transform: "translateZ(0)", // GPU accelerate
              backfaceVisibility: "hidden",
            }}
          />
        </motion.div>
      </div>

      {/* CATEGORIES */}
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

      {/* BAKING PROCESS */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-10 mt-28 max-w-7xl mx-auto px-4 md:px-8"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Baking Process
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            Every cake we bake is a blend of art and science. From choosing the
            finest ingredients to ensuring the perfect rise — we craft each
            treat with care and precision.
          </p>
          <a
            href="#designs"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full text-lg font-medium hover:bg-pink-700 transition-transform duration-200"
          >
            View More
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="/baking process.png"
            alt="Baking Process"
            className="w-full max-w-[450px] object-cover rounded-lg shadow-md"
            loading="lazy"
            decoding="async"
            width="700"
            height="500"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </motion.div>

      {/* DESIGNS */}
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

      {/* VIDEO */}
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
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;