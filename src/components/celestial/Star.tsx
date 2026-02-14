import React from "react";

// Texture assets are 512×256 (2:1); period = aspect ratio × element size for seamless loop
const TEXTURE_ASPECT_RATIO = 2;

interface StarProps {
  coreSize?: number;
  starColor?: string;
  textureRotationSpeed?: number; // Duration in seconds for one full texture rotation
}

function StarComponent({
  coreSize = 90,
  starColor = "yellow",
  textureRotationSpeed = 20, // Default rotation speed for star texture
}: StarProps) {
  const texturePeriodPx = TEXTURE_ASPECT_RATIO * coreSize;

  // Star colors based on type
  const starColors = {
    yellow: {
      core: "rgb(255, 255, 200)",
      inner: "rgb(255, 220, 100)",
      middle: "rgb(255, 180, 50)",
      outer: "rgb(255, 140, 0)",
      glow: "rgba(255, 220, 100, 0.15)",
    },
    white: {
      core: "rgb(255, 255, 255)",
      inner: "rgb(255, 255, 240)",
      middle: "rgb(255, 250, 200)",
      outer: "rgb(255, 240, 180)",
      glow: "rgba(255, 255, 240, 0.12)",
    },
    orange: {
      core: "rgb(255, 200, 150)",
      inner: "rgb(255, 180, 100)",
      middle: "rgb(255, 140, 50)",
      outer: "rgb(255, 100, 0)",
      glow: "rgba(255, 180, 100, 0.15)",
    },
  };

  const colors = starColors[starColor as keyof typeof starColors] || starColors.yellow;

  // Generate unique texture rotation animation name
  const textureAnimationName = `starTextureRotate-${coreSize}-${starColor}`;

  const glowSize = coreSize * 1.5;
  const outerGlowSize = coreSize * 2;

  return (
    <>
      {/* Outer glow - static */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: `${outerGlowSize}px`,
          height: `${outerGlowSize}px`,
          background: `radial-gradient(circle, ${colors.glow} 0%, ${colors.glow}00 100%, transparent 80%)`,
          zIndex: 500,
          filter: "blur(38px)",
        }}
      />

      {/* Middle glow - static */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          background: `radial-gradient(circle, ${colors.middle}30 0%, ${colors.outer}15 50%, transparent 100%)`,
          zIndex: 500,
          filter: "blur(4px)",
        }}
      />

      {/* Core star - static */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 500 }}>
        <div
          className="rounded-full shadow-2xl relative overflow-hidden"
          style={{
            width: `${coreSize}px`,
            height: `${coreSize}px`,
            background: `radial-gradient(circle at 30% 30%, ${colors.core}, ${colors.inner}, ${colors.middle}, ${colors.outer})`,
            boxShadow: `0 0 ${coreSize * 0.8}px ${coreSize * 0.3}px ${colors.glow}, 0 0 ${coreSize * 1.2}px ${coreSize * 0.5}px ${colors.glow}20, inset 0 0 ${coreSize * 0.3}px ${colors.core}`,
          }}
        >
          {/* Star texture overlay with rotation animation */}
          <div
            className={`absolute inset-0 rounded-full ${textureAnimationName}`}
            style={{
              backgroundImage: 'url(/textures/planet-texture-star.png)',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              backgroundPosition: `${texturePeriodPx}px 0`,
              mixBlendMode: 'overlay',
              opacity: 0.4,
              maskImage: 'radial-gradient(circle, black 0%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle, black 0%, black 100%)',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes ${textureAnimationName} {
          0% {
            background-position: ${texturePeriodPx}px 0;
          }
          100% {
            background-position: 0 0;
          }
        }
        .${textureAnimationName} {
          animation: ${textureAnimationName} ${textureRotationSpeed}s linear infinite;
        }
      `}</style>
    </>
  );
}

export const Star = React.memo(StarComponent);
