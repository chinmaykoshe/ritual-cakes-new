import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { designnames } from "../designs/designassets";
import ThemeSection from "./ThemeSection";

const Designs = () => {
  const navigate = useNavigate();
  const handleClickDesign = (designImages) => {
    navigate("/pagedesigns", { state: { designImages } });
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg lg:p-8 lg:m-top-16 shadow-lg">
      <section className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="lg:w-1/2 flex items-center justify-center">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
            useKeyboardArrows={true}
            autoPlay={true}
            interval={2000}
          >
            {Object.values(designnames).map((img, index) => (
              <div
                key={index}
                className="relative h-96"
                onClick={() => handleClickDesign(Object.values(designnames))}
              >
                <img
                  src={img}
                  alt={`Cake design ${index + 1}`}
                  className="object-contain rounded-lg w-full h-full shadow-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="lg:w-1/2 flex flex-col items-center text-center py-8">
          <p className="text-gray-500 font-bold text-xl mb-3 font-montserrat">
            Click the carousel to see all page designs.
          </p>
          <p className="text-darkcustombg1 font-bold text-xl mb-3 font-montserrat">
            See More Designs from Us
          </p>
          <a
            href="https://www.instagram.com/ritualcakes"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-darkcustombg2 text-white py-3 px-7 rounded-lg w-full max-w-xs flex items-center justify-center gap-2 hover:bg-white hover:text-darkcustombg2 border transition duration-300 shadow"
          >
            <i className="fa fa-instagram text-lg"></i>
            <span className="font-montserrat font-medium">View on Instagram</span>
          </a>
        </div>
      </section>
      <ThemeSection
        title="Engagement Theme"
        categoryPrefix="theme_engagement_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Mom Theme"
        categoryPrefix="theme_mom_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Dad Theme"
        categoryPrefix="theme_dad_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Anniversary Theme"
        categoryPrefix="theme_anniversary_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Boy Theme"
        categoryPrefix="theme_boy_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Cute Cake Theme"
        categoryPrefix="theme_cute_cake_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Girl Theme"
        categoryPrefix="theme_girl_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Profession Theme"
        categoryPrefix="theme_profession_design_"
        designnames={designnames}
      />
      <ThemeSection
        title="Retirement Theme"
        categoryPrefix="theme_retirement_design_"
        designnames={designnames}
      />
    </div>
  );
};

export default Designs;
