import { PlanetVisual } from "./PlanetVisual";
import { Rings } from "./Rings";
import type { PlanetData } from "@/types/planet";

export type { PlanetData };

interface FocusedPlanetProps {
  originalPlanet: PlanetData;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  endSize?: number; // Optional final size, defaults to 300
  animationDuration?: number; // Optional duration, defaults to 2000
  reverse?: boolean; // If true, animate from endPosition back to startPosition
  paused?: boolean; // If true, keep planet in place without animating
}

export function FocusedPlanet({ 
  originalPlanet, 
  startPosition, 
  endPosition,
  endSize = 300,
  animationDuration = 2000,
  reverse = false,
  paused = false
}: FocusedPlanetProps) {
  const startSize = originalPlanet.size;
  const scaleFactor = endSize / startSize;

  // For reverse animation, start from end position and go back to start
  const animationStartPos = reverse ? endPosition : startPosition;
  const animationEndPos = reverse ? startPosition : endPosition;
  const initialScale = reverse ? scaleFactor : 1;
  const finalScale = reverse ? 1 : scaleFactor;
  
  // When paused, the planet should be at endPosition with scaleFactor (where it is after forward animation)
  // When not paused, use animation starting from the appropriate position
  // Ensure we have valid positions before rendering
  if (!startPosition || !endPosition) {
    return null;
  }
  const currentPosition = paused ? endPosition : animationStartPos;
  const currentScale = paused ? scaleFactor : initialScale;
  
  // Calculate responsive sizes for grid overlay based on endSize (default 300px was original size)
  /* const baseSize = 300;
  const sizeRatio = endSize / baseSize;
  const overlaySize = 400 * sizeRatio; // Scale overlay proportionally */
  const overlaySize = endSize * 1.28;
  
  return (
    <div
      className="absolute pointer-events-none z-50 focused-planet"
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        opacity: 1,
        animation: paused 
          ? 'none' 
          : reverse
          ? `planetTransition ${animationDuration}ms ease-in forwards, planetFadeOut ${animationDuration}ms ease-in forwards`
          : `planetTransition ${animationDuration}ms ease-in-out forwards`,
        transformOrigin: 'center center',
        // When paused, ensure no transition that could cause jumping
        transition: paused ? 'none' : undefined,
      }}
    >
      <div
        className="relative"
        style={{
          width: `${startSize}px`,
          height: `${startSize}px`,
          transform: `scale(${currentScale})`,
          animation: paused ? 'none' : reverse ? `planetGrow ${animationDuration}ms ease-in-out forwards` : `planetGrow ${animationDuration}ms ease-in-out forwards`,
          transformOrigin: 'center center',
        }}
      >
        <PlanetVisual
          size={startSize}
          gradientColors={originalPlanet.gradientColors}
          glowColor={originalPlanet.glowColor}
          hasTexture={originalPlanet.hasTexture}
          textureName={originalPlanet.textureName}
          textureRotationSpeed={originalPlanet.textureRotationSpeed}
          textureRotationAngle={originalPlanet.textureRotationAngle}
        />
        {originalPlanet.hasRings && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Rings
              gradientColors={originalPlanet.gradientColors}
              ringRadius={originalPlanet.ringRadius}
              ringTiltAngle={originalPlanet.ringTiltAngle}
              size={startSize}
            />
          </div>
        )}
      </div>
      
      {/* Grid-scan overlay - only shown when planet is in place (paused) */}
      {/* Positioned at endPosition to match the green square target */}
      {paused && (
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${overlaySize}px`,
            height: `${overlaySize}px`,
            zIndex: 100,
            border: '1px solid hsla(174, 72%, 56%, 0.5)',
            opacity: 0,
            animation: 'gridOverlayFadeIn 800ms ease-out forwards',
            animationDelay: '200ms',
          }}
        >
          {/* Grid pattern - matching PlanetLegend button styling */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(45deg, hsla(174, 72%, 56%, 0.3) 1px, transparent 1px),
                linear-gradient(-45deg, hsla(174, 72%, 56%, 0.25) 1px, transparent 1px),
                linear-gradient(0deg, hsla(174, 72%, 56%, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, hsla(174, 72%, 56%, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: `
                18px 18px,
                22px 22px,
                14px 14px,
                16px 16px
              `,
              backgroundPosition: `
                0 0,
                4px 4px,
                2px 2px,
                1px 1px
              `,
              animation: 'gridShift 3s linear infinite',
              opacity: 0.2,
            }}
          />
          
          {/* Scanline overlay for CRT effect */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  hsla(174, 72%, 56%, 0.15) 2px,
                  hsla(174, 72%, 56%, 0.15) 4px
                )
              `,
              opacity: 0.3,
            }}
          />
          
          {/* Periodic scanning line */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, transparent 34%, hsla(174, 72%, 56%, 0.3) 50%, transparent 55%, transparent 100%)',
              animation: 'gridScanPeriodic 4s ease-in-out infinite',
            }}
          />
          
          {/* Subtle screen glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse at center,
                  hsla(174, 72%, 56%, 0.04) 0%,
                  transparent 70%
                )
              `,
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes planetTransition {
          from {
            left: ${animationStartPos.x}px;
            top: ${animationStartPos.y}px;
          }
          to {
            left: ${animationEndPos.x}px;
            top: ${animationEndPos.y}px;
          }
        }
        @keyframes planetGrow {
          from {
            transform: scale(${initialScale});
          }
          to {
            transform: scale(${finalScale});
          }
        }
        @keyframes planetFadeOut {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes gridShift {
          0% {
            background-position: 0 0, 4px 4px, 2px 2px, 1px 1px;
          }
          100% {
            background-position: 18px 18px, 26px 26px, 16px 16px, 17px 17px;
          }
        }
        @keyframes gridScanPeriodic {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          45% {
            transform: translateY(100%);
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        @keyframes gridOverlayFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
