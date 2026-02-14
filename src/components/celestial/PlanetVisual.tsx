import { useEffect, useRef, useState } from 'react';

// Texture assets are 512×256 (2:1); period = aspect ratio × element size for seamless loop
const TEXTURE_ASPECT_RATIO = 2;

interface PlanetVisualProps {
  size: number;
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  glowColor: string;
  hasTexture?: boolean;
  textureName?: string;
  textureRotationSpeed?: number; // Duration in seconds for one full texture rotation
  textureRotationAngle?: number; // Tilt texture by this angle (deg); motion runs along that angle (horizontal + vertical)
  isPulsating?: boolean;
}

export function PlanetVisual({
  size,
  gradientColors,
  glowColor,
  hasTexture = false,
  textureName,
  textureRotationSpeed = 8,
  textureRotationAngle = 0,
  isPulsating = false,
}: PlanetVisualProps) {
  // Extract RGB values from glowColor for pulsating effect
  const glowMatch = glowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const glowR = glowMatch ? parseInt(glowMatch[1]) : 34;
  const glowG = glowMatch ? parseInt(glowMatch[2]) : 211;
  const glowB = glowMatch ? parseInt(glowMatch[3]) : 238;
  
  // Generate unique animation name based on RGB values to avoid conflicts
  const animationName = `planetPulsate-${glowR}-${glowG}-${glowB}`;
  const fadeOutAnimationName = `planetPulsateFadeOut-${glowR}-${glowG}-${glowB}`;
  
  // Generate unique texture animation name (angle affects tilt so include it)
  const textureAnimationName = textureName ? `planetTextureRotate-${textureName}-${textureRotationAngle}` : '';
  const texturePeriodPx = TEXTURE_ASPECT_RATIO * size;
  // Initial position for seamless loop (animate from period to 0 in texture's local horizontal)
  const textureInitialPx = texturePeriodPx;

  // Track previous pulsating state to detect transitions
  const prevPulsatingRef = useRef(isPulsating);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  
  useEffect(() => {
    // If transitioning from pulsating to not pulsating, trigger fade-out
    if (prevPulsatingRef.current && !isPulsating) {
      setShouldFadeOut(true);
      // Reset fade-out flag after animation completes
      const timer = setTimeout(() => setShouldFadeOut(false), 500);
      return () => clearTimeout(timer);
    }
    prevPulsatingRef.current = isPulsating;
  }, [isPulsating]);
  
  // Determine which animation class to apply
  let animationClass = '';
  if (isPulsating) {
    animationClass = animationName;
  } else if (shouldFadeOut) {
    animationClass = fadeOutAnimationName;
  }
  
  return (
    <>
      <div
        className={`rounded-full shadow-lg relative overflow-hidden ${animationClass}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `linear-gradient(to bottom right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`,
          boxShadow: `0 0 ${size * 0.8}px ${size * 0.3}px ${glowColor}`,
        }}
      >
        {hasTexture && textureName && (
          <div
            className={`absolute inset-0 rounded-full ${textureAnimationName}`}
            style={{
              backgroundImage: `url(/textures/planet-texture-${textureName}.png)`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              backgroundPosition: `${textureInitialPx}px 0`,
              mixBlendMode: 'overlay',
              opacity: 0.5,
              maskImage: 'radial-gradient(circle, black 0%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle, black 0%, black 100%)',
              transform: `rotate(${textureRotationAngle}deg)`,
              transformOrigin: 'center center',
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes ${animationName} {
          0%, 100% {
            box-shadow: 0 0 40px 15px rgba(${glowR}, ${glowG}, ${glowB}, 0.4);
          }
          50% {
            box-shadow: 0 0 60px 25px rgba(${glowR}, ${glowG}, ${glowB}, 0.8);
          }
        }
        @keyframes ${fadeOutAnimationName} {
          from {
            box-shadow: 0 0 60px 25px rgba(${glowR}, ${glowG}, ${glowB}, 0.8);
          }
          to {
            box-shadow: 0 0 ${size * 0.8}px ${size * 0.3}px ${glowColor};
          }
        }
        .${animationName} {
          animation: ${animationName} 1.5s ease-in-out infinite;
        }
        .${fadeOutAnimationName} {
          animation: ${fadeOutAnimationName} 0.5s ease-out forwards;
        }
        ${textureAnimationName ? `
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
        ` : ''}
      `}</style>
    </>
  );
}
