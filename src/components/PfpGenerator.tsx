import React, { useEffect, useRef, useState } from "react";
import SidebarItem from "./SidebarItem";
import DoginalCard from "./DoginalCard";
import buttonLeft from "../assets/button-left.jpg";
import buttonRight from "../assets/button-right.jpg";
import { images } from "../data/imageData";
import { backgrounds, BackgroundItem } from "../data/backgroundsData";
import MobileSidebarItem from "./MobileSidebarItem";
import MobileBackgroundSlider from "./MobileBackgroundSlider";
import Starter from "../assets/STARTER PNG.png";
import Bark from "../assets/BARK PNG.png";
import Shibo from "../assets/SHIBO PNG.png";
import Yan from "../assets/YAN PNG.png"; 

const PfpGenerator: React.FC = () => {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("Static");
  const [selectedBackground, setSelectedBackground] =
    useState<BackgroundItem | null>(null);
  const [selectedSpecialBackground, setSelectedSpecialBackground] =
    useState<BackgroundItem | null>(null);
  const [nftNumber, setNftNumber] = useState("");
  const [solidBackground, setSolidBackground] = useState<BackgroundItem | null>(
    null
  );
  const [nftSrc, setNftSrc] = useState(images.genericDog2);

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

  const specialBackgrounds = backgrounds.filter((bg) => specialAssets.includes(bg.id) && bg.type === "overlay");

  // Some background IDs are "special"
   //const specialAssets2 = [
     //"bg-66",
     //"bg-67",
     //"bg-68",
     //"bg-70",
     //"bg-71",
     //"bg-72",
     //"bg-73",
     //"bg-74",
     //"bg-75",
     //"bg-76",
     //"bg-77",
   //];

  
  // For “Static”, “Animated”, or “Banner”
  const sidebarItems = ["Static", "Animated", "Soon"];
  const isBannerMode = selectedSidebarItem === "Banner.old"; //esto poner en BANNER cuando se active

  // Update the NFT URL whenever nftNumber changes
  useEffect(() => {
    // If user typed one of the special IDs, show the local image
    if (nftNumber === "10001") {
      setNftSrc(Bark);
    }else if (nftNumber === "0000") {
        setNftSrc(Starter);
    } else if (nftNumber === "10002") {
      setNftSrc(Shibo);
    } else if (nftNumber === "10003") {
      setNftSrc(Yan);
    } 
    // Otherwise, do your normal IPFS logic if user typed something else
    else if (nftNumber) {
      const nftImageName = `Doginal Dog ${nftNumber}.png`;
      const encoded = encodeURIComponent(nftImageName);
      setNftSrc(
        `https://turquoise-similar-urial-415.mypinata.cloud/ipfs/QmTydYkd37dU3evctzX3oZGeE5NqDaX5GpdkGgThySV2e1/${encoded}`
      );
    } 
    // If user typed nothing, fallback to your default
    else {
      setNftSrc(images.genericDog2);
    }
  }, [nftNumber]);

  // Return the backgrounds relevant to the current mode
  const getBackgroundOptions = () => {
    switch (selectedSidebarItem) {
      case "All":
        return backgrounds.filter((bg) => bg.type === "static" || "animated");
      case "Animated":
        return backgrounds.filter((bg) => bg.type === "animated");
      case "Static":
        return backgrounds.filter((bg) => bg.type === "static" && !bg.isSolidColor);
      case "Soon":
        return backgrounds.filter((bg) => bg.type === "static" && !bg.isSolidColor);
        //return backgrounds.filter((bg) => bg.type === "banner");
      default:
        return [];
    }
  };

  // If animated and the background is transparent, we need a solid color behind it
  const requiresSolidBackground =
    selectedSidebarItem === "Animated" && selectedBackground?.isTransparent;

  const handleSolidBackgroundChange = (bg: BackgroundItem) => {
    setSolidBackground(bg);
  };

  /**
   * The same logic we already have for picking a background:
   * - If it's in specialAssets => setSelectedSpecialBackground
   * - else => setSelectedBackground
   * - reset solid BG
   */
  const handleBackgroundClick = (bg: BackgroundItem) => {
    // If user clicks the already selected background, unselect it
    if (selectedBackground?.id === bg.id) {
      setSelectedBackground(null);
      //setSelectedSpecialBackground(null);
      //setSolidBackground(null);
      return;
    }
  
    if (selectedSpecialBackground?.id === bg.id) {
      setSelectedSpecialBackground(null);
      return;
    }
  
    // Otherwise, select the background
    if (specialAssets.includes(bg.id)) {
      setSelectedSpecialBackground(bg); 
    } else {
      setSelectedBackground(bg);
      //setSelectedSpecialBackground(null);
    }
  
    //setSolidBackground(null);
  };

  /**
   * Grab the entire background array and find which background is "active"
   * (whether it's selectedBackground or selectedSpecialBackground).
   * Then pick the next or prev item and call handleBackgroundClick() on it.
   */
  const handlePrevBackground = () => {
    const options = getBackgroundOptions();
    if (!options.length) return;

    // which background are we on?
    const currentSrc =
      selectedSpecialBackground?.src || selectedBackground?.src;
    let currentIndex = options.findIndex((bg) => bg.src === currentSrc);

    // If none selected, start at 0
    if (currentIndex === -1) currentIndex = 0;

    // Move one step left, but clamp at 0
    const nextIndex = Math.max(currentIndex - 1, 0);
    const nextBg = options[nextIndex];

    handleBackgroundClick(nextBg);
  };

  const handleNextBackground = () => {
    const options = getBackgroundOptions();
    if (!options.length) return;

    // which background are we on?
    const currentSrc =
      selectedSpecialBackground?.src || selectedBackground?.src;
    let currentIndex = options.findIndex((bg) => bg.src === currentSrc);

    // If none selected, start at 0
    if (currentIndex === -1) currentIndex = 0;

    // Move one step right, but clamp at the end
    const nextIndex = Math.min(currentIndex + 1, options.length - 1);
    const nextBg = options[nextIndex];

    handleBackgroundClick(nextBg);
  };

  return (
    //<div >
    <main className="mx-[19%] md:flex md:flex-col md:p-8 min-h-screen style2">{/*esto estaba en auto, para la version ok el mx-400 o [19%]*/}
      {/* Header */}
      {/* Mobile Sidebar */}
      <div className="md:hidden w-full mt-2 md:mt-0">
          <MobileSidebarItem
            label={selectedSidebarItem}
            isActive={false}
            onClick={(selectedLabel) => {
              setSelectedSidebarItem(selectedLabel);
              setSelectedBackground(null);
              setSelectedSpecialBackground(null);
              setSolidBackground(null);
            }}
            dropdownItems={sidebarItems}
          />
        </div>
      <header className="mx-auto md:w-1/2 justify-center items-end mb-2">
        
        {/* Sidebar */}
        <nav className="hidden w-full md:flex">
          <div className="flex w-full">
            {sidebarItems.map((label, index) => (
              <SidebarItem
                key={index}
                label={label}
                isActive={selectedSidebarItem === label}
                onClick={() => {
                  setSelectedSidebarItem(label);
                  setSelectedBackground(null);
                  setSelectedSpecialBackground(null);
                  setSolidBackground(null);
                }}
              />
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="mx-auto ">{/*esto estaba en auto*/}
        {/* Preview & Controls */}

        <div className="flex items-center"> {/*esto es para los botones de navegacion*/}
          <button
            onClick={handlePrevBackground}
            className="h-[100px] font-bold"
          >
            <img width={50} src={buttonLeft} alt="Previous" />
          </button>

          <div className="md:w-1/2 relative mx-auto gap-2"> {/*esto es para el ancho del card. estaba en 1/2*/}
            <DoginalCard
              nftNumber={nftNumber}
              setNftNumber={setNftNumber}
              selectedBackground={selectedBackground}
              selectedSpecialBackground={selectedSpecialBackground}
              solidBackground={solidBackground}
              nftSrc={nftSrc}
              isBannerMode={isBannerMode}
            />

            {/* Solid BG selection */}
            <div className="bg-white p-1 border border-white hidden md:flex flex-col mb-2">
              <h2 className="text-small text-center font-bold mb-1">Select Solid Background</h2>
              <div className="flex justify-center flex-wrap gap-2">
                {backgrounds
                  .filter((bg) => bg.isSolidColor)
                  .map((bg, idx) => (
                    <img
                      key={idx}
                      src={bg.src}
                      alt={bg.name}
                      className={`w-10 h-10 object-cover border-2 solid-class ${
                        solidBackground?.src === bg.src
                          ? "border-black border-2"
                          : "border-gray-200"
                      } cursor-pointer`}
                      onClick={() => handleSolidBackgroundChange(bg)}
                    />
                  ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleNextBackground}
            className="h-[100px] font-bold">
            <img width={50} src={buttonRight} alt="Next" className="relative" />
          </button>
        </div>

        {/* Mobile Slider */}
        <MobileBackgroundSlider
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          selectedSpecialBackground={selectedSpecialBackground}
          setSelectedSpecialBackground={setSelectedSpecialBackground}
          solidBackground={solidBackground}
          setSolidBackground={setSolidBackground}
          requiresSolidBackground={requiresSolidBackground ?? false}
          getBackgroundOptions={getBackgroundOptions}
          handleSolidBackgroundChange={handleSolidBackgroundChange}
          isBannerMode={isBannerMode}
        />

        {/* Scenes */}
        <div className="border-2 border-white hidden md:flex flex-col style">
          <h2 className="text-small text-center font-bold mb-1">Select Scene</h2>
            <div className="scrollbar-right-container h-[105px] overflow-y-scroll overflow-x-hidden">
              <div className="scrollbar-left-content flex flex-wrap gap-4">
                {getBackgroundOptions().map((bg, idx) => (
                  <img
                    key={idx}
                    src={bg.src}
                    alt={bg.name}
                    className={`w-20 h-20 object-cover border-2 solid-class ${
                      isBannerMode ? "w-1/5" : "w-1/12"
                    } object-cover border-2 s-b ${
                      selectedBackground?.src === bg.src ||
                      selectedSpecialBackground?.src === bg.src
                        ? "border-black border-2"
                        : "border-gray-300" 
                    } cursor-pointer ${ isBannerMode ? "border-black border-2" : ""}`}
                    onClick={() => handleBackgroundClick(bg)}
                 />
                ))}
              </div>
            </div>
        </div>
        <div className="border-2  border-white hidden md:flex flex-col style ">    
            {/* Special Backgrounds */}
            {specialBackgrounds.length > 0 && !isBannerMode && (
              <div className="mt-0 w-full ">
               <h2 className="text-small text-center font-bold mb-1">Overlay</h2>
                <div className="flex flex-wrap gap-3">
                  {specialBackgrounds.map((bg, idx) => (
                    <img
                      key={idx}
                      src={bg.src}
                      alt={bg.name}
                      className={`w-20 h-20 object-cover border-2 ${
                       selectedSpecialBackground?.src === bg.src
                         ? "border-black border-2"
                          : "border-gray-300"
                      } cursor-pointer`}
                      onClick={() => {
                        handleBackgroundClick(bg);
                        // Special backgrounds coexist with static backgrounds
                      }}
                   />
                 ))}
                </div>              
              </div>
            )}
          </div>
        </div>
    </main>
    //</div>

  );
};

export default PfpGenerator;
