    import React from "react";
    import { NavLink, useNavigate } from "react-router-dom";
    import { Carousel } from "react-responsive-carousel";
    import "react-responsive-carousel/lib/styles/carousel.min.css";
    import { designnames } from "../designs/designassets";
    import DesignCard from "./DesignCard";

    const ThemeSection = ({ title, categoryPrefix, designnames }) => {
      // Filter design names by category prefix
      const filteredDesignKeys = Object.keys(designnames).filter((key) =>
        key.startsWith(categoryPrefix)
      );

      return (
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-brown mb-6">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4">
            {filteredDesignKeys.map((designKey) => (
              <DesignCard
                key={designKey}
                designnames={designnames}
                designKey={designKey}
              />
            ))}
          </div>
        </section>
      );
    };

    const Designs = () => {
      const navigate = useNavigate();

      const handleClickDesign = (designImages) => {
        navigate("/pagedesigns", { state: { designImages } });
      };

      return (
        <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg px-4 lg:p-8 lg:m-top-16 shadow-lg">
          {/* Carousel Section */}
          <section className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 flex items-center justify-center">
              <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false} // Hiding dots at the bottom
          infiniteLoop={true}
          useKeyboardArrows={true}
          autoPlay={true}
          interval={1500}
              >
                {Object.values(designnames).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-96"
                    onClick={() => handleClickDesign(Object.values(Designs))}
                  >
                    <img
                      src={img}
                      alt={`Cake design ${index + 1}`}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="lg:w-1/2 h-full flex flex-col items-center justify-center text-center">
              <p className="text-brown font-montserrat font-bold text-4xl mb-4">
                View from Our Page
              </p>
              <NavLink
                to="https://www.instagram.com/ritualcakes"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-darkcustombg2 hover:border-2 hover:border-orange-300 text-white py-4 px-8 rounded-lg w-full transform transition duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa fa-instagram text-2xl"></i>
                <span className="font-montserrat font-medium">View</span>
              </NavLink>
            </div>
          </section>

          {/* Theme Sections */}
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
