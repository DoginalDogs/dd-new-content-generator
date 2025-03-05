// DoginalCard.tsx
import React, { useEffect, useRef, useState } from "react";
import { BackgroundItem } from "../data/backgroundsData";
import GIF from "gif.js";
import { parseGIF, decompressFrames } from "gifuct-js";
import BannerOverlay from "../assets/Banner_Overlay.png"; 

interface DoginalCardProps {
  nftNumber: string;
  setNftNumber: (number: string) => void;
  selectedBackground: BackgroundItem | null;
  selectedSpecialBackground: BackgroundItem | null;
  solidBackground: BackgroundItem | null;
  nftSrc: string;

  // NEW:
  isBannerMode: boolean;
}

const COLOR_MAP: Record<string, string> = {
  "Tan.png": "#f8e49e",
  "Blue.png": "#64ffff",
  "Aqua.png": "#4ffcd1",
  "Yellow.png": "#ffe154",
  "Rose.png": "#ffb1dd",
  "Pink.png": "#ffd0eb",
  "Red.png": "#ff7d82",
  "Purple.png": "#d8bdfa",
  "Green.png": "#8dffa4",
};

const DoginalCard: React.FC<DoginalCardProps> = ({
  nftNumber,
  setNftNumber,
  selectedBackground,
  selectedSpecialBackground,
  solidBackground,
  nftSrc,
  isBannerMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bannerBackground, setBannerBackground] = useState("#f8e49e");
  const [twitterHandle, setTwitterHandle] = useState("@YourHandle");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>(""); // final output
  // Check if the main background is animated
  const isAnimatedBackground = selectedBackground?.type === "animated";

  useEffect(() => {
    // If in banner mode and user picks a "solid" background .png
    if (isBannerMode && solidBackground?.src) {
      const filename = solidBackground.src.split("/").pop() || "";
      // Lowercase for safer matching:
      const colorHex = COLOR_MAP[filename];
      setBannerBackground(colorHex);
    }
  }, [isBannerMode, solidBackground]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setNftNumber(e.target.value);
  };

  const loadCustomFont = async (fontName: string, fontUrl: string) => {
    const font = new FontFace(fontName, `url(${fontUrl})`);
    await font.load();
    document.fonts.add(font);
  };

  const handleGenerateBanner = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    try { 
       // Load Funnel Display font before using it in canvas
       await loadCustomFont("Funnel Display", "/fonts/FunnelDisplay-Bold.ttf");
      // 1) Load the 1000x1000 NFT
      const nftImg = await loadImage(nftSrc);
  
      // Quick resolution check
      if (nftImg.width !== 1000 || nftImg.height !== 1000) {
        alert("This dog image must be 1000x1000 for the banner logic!");
        setIsProcessing(false);
        setIsLoading(false);
        return;
      }

      // 2) Create a canvas for 1500x500
      const canvas = document.createElement("canvas");
      canvas.width = 1500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("Could not get 2D context");
        setIsProcessing(false);
        setIsLoading(false);
        return;
      }

      // 3) Fill with chosen background color
      ctx.fillStyle = bannerBackground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4) Optionally draw some overlay or background image here
      //    (If you have a second overlay image, load & draw it before the dog.)

      if (selectedBackground?.src) {
        const backgroundImg = await loadImage(selectedBackground.src);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
      }

      if(selectedSpecialBackground?.src) {
        const specialBgImg = await loadImage(selectedSpecialBackground.src);
        ctx.drawImage(specialBgImg, 0, 0, canvas.width, canvas.height);
      }

      // 5) Draw the dog image on the right side
      //    (like your snippet, draws it at (980,0) sized 500×500)
      ctx.drawImage(nftImg, 980, 0, 500, 500);

      // 6) Finally, draw the handle text in the middle, below the dog
      ctx.fillStyle = "#000000";
      ctx.font = "30px 'Funnel Display'"; // Now the font is loaded
      ctx.textAlign = "center";
      ctx.fillText(twitterHandle, canvas.width / 2, canvas.height / 2 + 130);

      // 7) Convert to dataURL & store
      const finalDataUrl = canvas.toDataURL("image/png");
      const blob = await fetch(finalDataUrl).then((res) => res.blob());
      setBannerImageUrl(finalDataUrl);
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `Doginal_Dog_Static_${nftNumber || "1"}.png`);
      URL.revokeObjectURL(url);
      //console.log("Banner generated:", finalDataUrl);
    } catch (err) {
      console.error("Error generating banner:", err);
      alert("Could not generate banner. See console for details.");
    }
    setIsProcessing(false);
    setIsLoading(false);
  };

  // Helper: load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(`Failed to load image: ${src}`);
    });
  };

  // Drawing static layers
  const drawImageLayers = async (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Base layering
    const imagesToLoad = [
      solidBackground,
      selectedBackground,
      { src: nftSrc },
      selectedSpecialBackground,
    ];

    // NEW: If in "Banner" mode, push the overlay as the final top layer
    if (isBannerMode) {
      imagesToLoad.push({ src: BannerOverlay });
      // (Adjust the path to wherever you store Banner_Overlay.png)
    }

    const layers: (HTMLImageElement | null)[] = await Promise.all(
      imagesToLoad.map(async (layer) => {
        if (layer?.src) {
          try {
            return await loadImage(layer.src);
          } catch {
            return null;
          }
        }
        return null;
      })
    );

    context.clearRect(0, 0, width, height);
    layers.forEach((img) => {
      if (img) context.drawImage(img, 0, 0, width, height);
    });
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleDownload = async () => {
    if (isBannerMode) {
      // Just do the banner approach
      handleGenerateBanner();
      return;
    }

    // Otherwise, do the usual static/animated logic
    setIsLoading(true);

    try {
      // Ensure we have a canvas
      const canvas = canvasRef.current;
      if (!canvas) {
        alert("Canvas not available.");
        setIsLoading(false);
        return;
      }
      const context = canvas.getContext("2d");
      if (!context) {
        alert("Failed to get canvas context.");
        setIsLoading(false);
        return;
      }
  
      // Preload the NFT
      const nftImage = await loadImage(nftSrc);
  
      // ============ Static =============
      if (!isAnimatedBackground) {
        canvas.width = nftImage.width;
        canvas.height = nftImage.height;
        await drawImageLayers(context, nftImage.width, nftImage.height);
  
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl, `Doginal_Dog_${nftNumber || "1"}.png`);
        setNftNumber("");
        setIsLoading(false);

        // ============ Animated ============
      } else {
        try {
          // If there's no separate solid BG
          if (!solidBackground?.src) {
            const gifResponse = await fetch(selectedBackground!.src);
            const gifArrayBuffer = await gifResponse.arrayBuffer();
            const gifBase64 = arrayBufferToBase64(gifArrayBuffer);

            const requestData = {
              gifData: gifBase64,
              pngUrl: nftSrc,
            };
    
            const response = await fetch(
              "https://gifgenerator-ca69eae66edb.herokuapp.com/generate-gif",
              {
                method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
            );
            if (!response.ok) throw new Error("Failed to generate GIF");
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            triggerDownload(url, `Doginal_Dog_${nftNumber || "1"}.gif`);
            URL.revokeObjectURL(url);
            setNftNumber("");
            setIsLoading(false)
          } else {
            // If user picked a solid BG behind the animated one
            const response = await fetch(selectedBackground!.src);
            const arrayBuffer = await response.arrayBuffer();
            const gif = parseGIF(arrayBuffer);
            const frames = decompressFrames(gif, true);
      
            const gifWidth = frames[0].dims.width;
            const gifHeight = frames[0].dims.height;
      
            const gifGenerator = new GIF({
              workers: 5,
              quality: 1,
              width: gifWidth,
              height: gifHeight,
              workerScript: `${process.env.PUBLIC_URL}/ccapture/gif.worker.js`, 
            });
 
            // Preload
            const nftImg = await loadImage(nftSrc);
            const solidBgImg = await loadImage(solidBackground.src);

            let specialBgImg: HTMLImageElement | null = null;
            if (selectedSpecialBackground?.src) {
              specialBgImg = await loadImage(selectedSpecialBackground.src);
            }

            // Temp canvas
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = gifWidth;
            tempCanvas.height = gifHeight;
            const tempContext = tempCanvas.getContext("2d")!;
      
            for (const frame of frames) {
              tempContext.clearRect(0, 0, gifWidth, gifHeight);
      
              // 1) solid BG
              tempContext.drawImage(solidBgImg, 0, 0, gifWidth, gifHeight);
      
              // 2) GIF frame
              const frameCanvas = document.createElement("canvas");
              frameCanvas.width = gifWidth;
              frameCanvas.height = gifHeight;
              const frameContext = frameCanvas.getContext("2d")!;
      
              const frameImageData = frameContext.createImageData(
                frame.dims.width,
                frame.dims.height
              );
              frameImageData.data.set(frame.patch);
              frameContext.putImageData(
                frameImageData,
                frame.dims.left,
                frame.dims.top
              );
              tempContext.drawImage(frameCanvas, 0, 0);
      
              // 3) NFT
              tempContext.drawImage(nftImg, 0, 0, gifWidth, gifHeight);
      
              // 4) special BG on top
              if (specialBgImg) {
                tempContext.drawImage(specialBgImg, 0, 0, gifWidth, gifHeight);
              }

              gifGenerator.addFrame(tempContext, {
                copy: true,
                delay: frame.delay,
              });
            }
      
            gifGenerator.on("finished", (blob: Blob) => {
              const url = URL.createObjectURL(blob);
              triggerDownload(url, `Doginal_Dog_${nftNumber || "1"}.gif`);
              URL.revokeObjectURL(url);
              setIsLoading(false);
            });
      
            gifGenerator.render();
          }  
        } catch (error) {
          console.error("Error processing animated download:", error);
          alert("An error occurred while generating the animated GIF.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error processing download:", error);
      alert("An error occurred while generating the image.");
      setIsLoading(false);
    }
  };
  
  const triggerDownload = (dataUrl: string, filename: string) => {
    if (!isBannerMode) {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } else {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      // Ensure it's in the DOM
      document.body.appendChild(link);
      link.click();
      // Clean up
      document.body.removeChild(link);
    }
  };               

  return (
    <aside className="md:py-4 md:pt-0 flex flex-col items-center w-full">
      {/* Input + Download Button */}
      <div className="flex flex-col items-center w-full gap-2 mb-3">
        <label className="text-white font-semibold">
          Type your Doginal Dog ID #
        </label>

        <input
          type="number"
          value={nftNumber}
          onChange={handleInputChange}
          placeholder="#0000"
          className="w-full px-2 py-1 text-small text-black border-2 border-white bg-neutral-100 text-center"
        />

        {isBannerMode && (
          <input
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@YourHandle"
            className="w-full px-2 py-1 text-small border-2 border-white bg-neutral-100 text-center"
        />
        )}

        <div className="w-full flex gap-2">
          <button
              className="w-full px-3 py-1 mr-2 text-sm bg-white text-black font-semibold"
              onClick={handleDownload} 
            >
              Go Back
            </button>
            <button
              className="w-full px-3 py-1 text-sm bg-white text-black font-semibold"
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Download"}
          </button>
        </div>
      </div> 

      {/* Preview Box (stacked <img> tags) */}
      <div
        className={`relative w-full h-0 pb-[100%] border-2 border-white ${
          isBannerMode ? "banner" : ""
        }`}
      >
        {/* (1) Solid background */}
        {solidBackground?.src && (
          <img
            src={solidBackground.src}
            alt="Solid Background"
            className={`absolute inset-0 w-full h-full object-cover `}
            style={{ zIndex: 0 }}
          />
        )}

        {/* (2) Normal background */}
        {selectedBackground?.src && (
          <img
            src={selectedBackground.src}
            alt="Background"
            className={`absolute inset-0 w-full h-full object-cover ${
              isBannerMode ? "banner-image" : ""
            }`}
            style={{ zIndex: 1 }}
          />
        )}

        {/* (3) The PFP / NFT image */}
        {nftSrc && (
          <img
            src={nftSrc}
            alt="NFT"
            className={`absolute inset-0 w-full h-full object-cover ${
              isBannerMode ? "banner-image2" : ""
            }`}
            style={{ zIndex: 2 }}
          />
        )}

        {/* (4) Special background (on top) */}
        {selectedSpecialBackground?.src && (
          <img
            src={selectedSpecialBackground.src}
            alt="Special Background"
            className={` ${isBannerMode ? "banner-image3 relative top-1" : "absolute w-full h-full object-cover"}  inset-0  `}
            style={{ zIndex: 3 }}
          />
        )}

        {isBannerMode && (
          <img
            src={nftSrc}
            alt="PFP Overlay"
            className="absolute  w-28 h-28 right-10 top-5"
            style={{ zIndex: 4 }}
          />
        )}

        {/* (5) NEW: Banner overlay on top if in "Banner" mode */}
        {isBannerMode && (
          <img
            src={BannerOverlay}
            alt="Banner Overlay"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 5 }}
          />
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </aside>
  );
};

export default DoginalCard;
