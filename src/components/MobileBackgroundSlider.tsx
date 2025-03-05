import React, { useState } from "react";
import { backgrounds, BackgroundItem } from "../data/backgroundsData";
import LeftArrowIcon from "../assets/button-left.jpg";
import RightArrowIcon from "../assets/button-right.jpg";

interface MobileBackgroundSliderProps {
  selectedBackground: BackgroundItem | null;
  setSelectedBackground: (bg: BackgroundItem | null) => void;
  selectedSpecialBackground: BackgroundItem | null;
  setSelectedSpecialBackground: (bg: BackgroundItem | null) => void;
  solidBackground: BackgroundItem | null;
  setSolidBackground: (bg: BackgroundItem | null) => void;
  requiresSolidBackground: boolean;
  getBackgroundOptions: () => BackgroundItem[];
  handleSolidBackgroundChange: (bg: BackgroundItem) => void;
  //handleSolidColorChange: (bg: BackgroundItem) => void;
  isBannerMode: boolean;
}

const MobileBackgroundSlider: React.FC<MobileBackgroundSliderProps> = ({
  selectedBackground,
  setSelectedBackground,
  selectedSpecialBackground,
  setSelectedSpecialBackground,
  solidBackground,
  setSolidBackground,
  requiresSolidBackground,
  getBackgroundOptions,
  handleSolidBackgroundChange,
  //handleSolidColorChange,
  isBannerMode
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define the special assets IDs
  // const specialAssets = [
  //   "bg-66",
  //   "bg-67",
  //   "bg-68",
  //   "bg-70",
  //   "bg-71",
  //   "bg-72",
  //   "bg-73",
  //   "bg-74",
  //   "bg-75",
  //   "bg-76",
  //   "bg-77",
  // ];

  
  const specialAssets = [  
    "bg-78",
    "bg-79",
    "bg-80",
    "bg-81",
    "bg-82",
    "bg-83",
    "bg-94",
    "bg-95",
    "bg-96",
    "bg-97",
    "bg-98",
    "bg-99",
    "bg-100",
  ];

  // Separate backgrounds into special and normal
  const normalBackgrounds = getBackgroundOptions();
  const specialBackgrounds = backgrounds.filter((bg) => specialAssets.includes(bg.id) && bg.type === "overlay"); // Special assets only available in the "Static" category

  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(normalBackgrounds.length / itemsPerSlide);

  const handleNextSlide1 = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide1 = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  const handleNextSlide2 = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide2 = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="p-3">
      <div className="md:hidden relative w-full border-2 border-white bg-white p-2 mb-2">
        {/* Navigation Arrows */}
        {/*<button
            onClick={handlePrevSlide2}
            className="absolute insex-x-0 -left-6 top-[50%] z-10" 
            aria-label="Previous"
          >
            <img src={LeftArrowIcon} alt="Previous" className="w- h-6" />
          </button>*/}
        <h2 className="text-small font-bold mb-2">Select Solid Background</h2>
        <div className="flex justify-center flex-wrap gap-3"> {/* flex flex-wrap gap-3 *old * -Para linea sola - flex justify-start gap-3 overflow-hidden w-full */}
          {backgrounds
            .filter((bg) => bg.isSolidColor)
            .map((bg, idx) => (
              <img
                key={idx}
                src={bg.src}
                alt={bg.name}
                className={`w-10 h-10 object-cover solid-class border-2 ${
                  solidBackground?.src === bg.src
                    ? "border-black border-2"
                    : "border-gray-200"
                } cursor-pointer`}
                onClick={() => handleSolidBackgroundChange(bg)}
              />
            ))}
        </div>
        {/*<button
            onClick={handleNextSlide2}
            className="absolute insex-y-0 -right-6 top-[50%] z-10"
            aria-label="Next"
          >
            <img src={RightArrowIcon} alt="Next" className="w-6 h-6" />
          </button>*/}
      </div>
      <div className="md:hidden relative w-full border-2 border-white bg-white p-2">
        {/* Solid Background Selection */}

        <div>
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide1}
            className="absolute insex-x-0 -left-6 top-[20%] z-10" 
            aria-label="Previous"
          >
            <img src={LeftArrowIcon} alt="Previous" className="w- h-6" />
          </button>
          <h2 className="text-small font-bold mb-2">Select Scene</h2>
          <div className="relative flex items-center">
            {/* Normal Backgrounds */}
            <div className="flex justify-start gap-3 overflow-hidden w-full">
              {normalBackgrounds
                .slice(
                  currentSlide * itemsPerSlide,
                  currentSlide * itemsPerSlide + itemsPerSlide
                )
                .map((bg, idx) => (
                  <div key={idx} className="flex-shrink-0 w-1/8">
                    <img
                      src={bg.src}
                      alt={bg.name}
                      className={`w-12 h-12 object-cover border-2 ${
                        selectedBackground?.src === bg.src
                          ? "border-black border-2"
                          : "border-gray-200"
                      } cursor-pointer`}
                      onClick={() => {
                        setSelectedBackground(bg);
                        // Allow both static and special background layers to coexist
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={handleNextSlide1}
            className="absolute insex-y-0 -right-6 top-[20%] z-10"
            aria-label="Next"
          >
            <img src={RightArrowIcon} alt="Next" className="w-6 h-6" />
          </button>
        </div>

        {/* Special Backgrounds */}
        {specialBackgrounds.length > 0 && !isBannerMode && (
          <div className="mt-6 w-full">
            <h2 className="text-small font-bold mb-2">Overlay</h2>
            <div className="flex flex-wrap gap-3">
              {specialBackgrounds.map((bg, idx) => (
                <img
                  key={idx}
                  src={bg.src}
                  alt={bg.name}
                  className={`w-12 h-12 object-cover border-2 ${
                    selectedSpecialBackground?.src === bg.src
                      ? "border-black border-2"
                      : "border-gray-200"
                  } cursor-pointer`}
                  onClick={() => {
                    setSelectedSpecialBackground(bg);
                    // Special backgrounds coexist with static backgrounds
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileBackgroundSlider;
