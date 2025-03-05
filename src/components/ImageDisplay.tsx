import React, { useRef, useEffect } from 'react';

interface ImageDisplayProps {
  solidBackgroundSrc: string | null;
  backgroundSrc: string;
  nftSrc: string;
  applyChanges: boolean;
}
const ImageDisplay: React.FC<ImageDisplayProps> = ({
  solidBackgroundSrc,
  backgroundSrc,
  nftSrc,
  applyChanges,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && backgroundSrc && nftSrc) {
      const context = canvas.getContext('2d');
      if (context) {
        const solidBg = new Image();
        const background = new Image();
        const nft = new Image();

        solidBg.crossOrigin = 'Anonymous';
        background.crossOrigin = 'Anonymous';
        nft.crossOrigin = 'Anonymous';

        // Load images
        let imagesLoaded = 0;
        const onImageLoad = () => {
          imagesLoaded += 1;
          if (
            imagesLoaded ===
            (solidBackgroundSrc ? 3 : 2) // If solid background is used, wait for all 3 images
          ) {
            // Set canvas dimensions based on the background image
            canvas.width = background.width;
            canvas.height = background.height;

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw solid background if applicable
            if (solidBackgroundSrc) {
              context.drawImage(solidBg, 0, 0, canvas.width, canvas.height);
            }

            // Draw the background image
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Draw the NFT image
            context.drawImage(nft, 0, 0, canvas.width, canvas.height);
          }
        };

        if (solidBackgroundSrc) {
          solidBg.src = solidBackgroundSrc;
          solidBg.onload = onImageLoad;
        } else {
          imagesLoaded += 1; // Skip solid background
        }

        background.src = backgroundSrc;
        background.onload = onImageLoad;

        nft.src = nftSrc;
        nft.onload = onImageLoad;
      }
    }
  }, [solidBackgroundSrc, backgroundSrc, nftSrc, applyChanges]);

  
  return (
    <div className="relative w-full h-0 pb-[100%] bg-white border-2 border-black">
      {/* Solid Background */}
      {solidBackgroundSrc && (
        <img
          src={solidBackgroundSrc}
          alt="Solid Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Background (can be animated) */}
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* NFT Image */}
      {nftSrc && (
        <img
          src={nftSrc}
          alt="NFT"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );

};

export default ImageDisplay;
