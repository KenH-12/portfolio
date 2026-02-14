import { useIsMobile } from '@/hooks/use-mobile';
import { PlanetVisual } from '@/components/celestial/PlanetVisual';
import { Rings } from '@/components/celestial/Rings';
import { TargetSquare } from '@/components/layout/TargetSquare';
import type { PlanetData } from '@/types/planet';

interface ContentSectionProps {
  title: string;
  titleGradient: string; // e.g., 'gradient-text-red', 'gradient-text-cyan', etc.
  isTransitioning?: boolean;
  showSection?: boolean;
  backgroundGradientColor?: string; // e.g., 'hsl(174,72%,56%,0.05)' or 'hsl(150,70%,50%,0.05)'
  backgroundBlobColor?: string; // e.g., 'bg-primary/5' or 'bg-neon-green/5'
  planetData?: PlanetData; // Planet data for mobile display
  shouldShowSquare?: boolean;
  isReversing?: boolean;
  children: React.ReactNode;
}

export function ContentSection({
  title,
  titleGradient,
  isTransitioning = false,
  showSection = false,
  backgroundGradientColor = 'hsl(174,72%,56%,0.05)',
  backgroundBlobColor = 'bg-primary/5',
  planetData,
  shouldShowSquare = false,
  isReversing = false,
  children,
}: ContentSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section className={`relative w-full flex lg:items-end justify-center overflow-y-auto lg:overflow-visible min-h-0 lg:min-h-screen lg:h-screen ${
      isMobile ? 'pt-8' : 'pt-32'
    }`}>
      {/* Background Effects */}
      <div 
        className="absolute inset-0" 
        style={{
          background: `radial-gradient(ellipse at center, ${backgroundGradientColor} 0%, transparent 50%)`,
        }}
      />
      <div className={`absolute top-1/4 right-1/4 w-96 h-96 ${backgroundBlobColor} rounded-full blur-3xl animate-float`} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(222,30%,15%,0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(222,30%,15%,0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="relative z-10 w-full lg:h-full flex lg:items-center lg:pr-6 py-8 min-[1440px]:ml-[15%]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 lg:max-w-6xl 2xl:max-w-[100%] w-full lg:px-6">
          {/* Left side - Heading and Content */}
          <div className="flex-[2] space-y-6 w-full lg:w-auto">
            <div className="relative flex items-center justify-between">
              <h2 
                className="font-hero-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight relative overflow-hidden flex-1 ml-2"
                style={{
                  clipPath: isMobile ? 'inset(0 0% 0 0)' : (showSection && !isTransitioning ? 'inset(0 100% 0 0)' : 'inset(0 100% 0 0)'),
                  animationName: !isMobile && showSection && !isTransitioning ? 'textReveal' : 'none',
                  animationDuration: !isMobile && showSection && !isTransitioning ? '0.8s' : undefined,
                  animationTimingFunction: !isMobile && showSection && !isTransitioning ? 'ease-out' : undefined,
                  animationDelay: !isMobile && showSection && !isTransitioning ? '0.5s' : undefined,
                  animationFillMode: 'both',
                }}
              >
                <span className={`${titleGradient} relative z-10`}>{title}</span>
                {!isMobile && (
                  <span 
                    className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
                    style={{
                      width: '3px',
                      height: '100%',
                      zIndex: 5,
                      animationName: showSection && !isTransitioning ? 'headingScanLine' : 'none',
                      animationDuration: showSection && !isTransitioning ? '0.8s' : undefined,
                      animationTimingFunction: showSection && !isTransitioning ? 'ease-out' : undefined,
                      animationDelay: showSection && !isTransitioning ? '0.25s' : undefined,
                      animationFillMode: 'forwards',
                      boxShadow: '0 0 15px hsla(174, 72%, 56%, 0.8), 0 0 30px hsla(174, 72%, 56%, 0.4)',
                    }}
                  />
                )}
              </h2>
              {/* Mobile Planet - right-justified, aligned with header */}
              {isMobile && planetData && (
                <div className="flex-shrink-0 ml-4 mr-8 relative" style={{ width: `${planetData.size}px`, height: `${planetData.size}px` }}>
                  <PlanetVisual
                    size={planetData.size}
                    gradientColors={planetData.gradientColors}
                    glowColor={planetData.glowColor}
                    hasTexture={planetData.hasTexture}
                    textureName={planetData.textureName}
                    textureRotationSpeed={planetData.textureRotationSpeed}
                    textureRotationAngle={planetData.textureRotationAngle}
                  />
                  {planetData.hasRings && (
                    <Rings
                      gradientColors={planetData.gradientColors}
                      ringRadius={planetData.ringRadius}
                      ringTiltAngle={planetData.ringTiltAngle}
                      size={planetData.size}
                    />
                  )}
                </div>
              )}
            </div>
            <div 
              className={`relative flex w-full ${
                isMobile ? 'overflow-y-auto' : 'overflow-visible'
              }`}
              style={{ 
                fontFamily: "'Share Tech Mono', monospace", 
                color: "hsla(174, 72%, 70%, 0.9)",
                clipPath: isMobile ? 'inset(0 0% 0 0)' : (showSection && !isTransitioning ? 'inset(0 100% 0 0)' : 'inset(0 100% 0 0)'),
                animationName: !isMobile && showSection && !isTransitioning ? 'textReveal' : 'none',
                animationDuration: !isMobile && showSection && !isTransitioning ? '1s' : undefined,
                animationTimingFunction: !isMobile && showSection && !isTransitioning ? 'linear' : undefined,
                animationDelay: !isMobile && showSection && !isTransitioning ? '0.8s' : undefined,
                animationFillMode: 'both',
              }}
            >
              {!isMobile && (
                <span 
                  className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-10"
                  style={{
                    width: '3px',
                    height: '100%',
                    animationName: showSection && !isTransitioning ? 'listScanLine' : 'none',
                    animationDuration: showSection && !isTransitioning ? '1s' : undefined,
                    animationTimingFunction: showSection && !isTransitioning ? 'linear' : undefined,
                    animationDelay: showSection && !isTransitioning ? '0.8s' : undefined,
                    animationFillMode: 'forwards',
                    boxShadow: '0 0 15px hsla(174, 72%, 56%, 0.8), 0 0 30px hsla(174, 72%, 56%, 0.4)',
                  }}
                />
              )}
              {children}
            </div>
          </div>

          {/* Right side - TargetSquare for planet transitions */}
          {/* Always render TargetSquare (even when hidden) so it can be found for position calculation */}
          <div className="flex-1 flex items-start justify-center lg:pr-0 target-square-container">
            <TargetSquare
              isMobile={isMobile}
              shouldShowSquare={shouldShowSquare}
              isTransitioning={isTransitioning}
              isReversing={isReversing}
            />
            {(isTransitioning || showSection) && (
              <style>{`
                @keyframes textReveal {
                  0% {
                    opacity: 0;
                    clip-path: inset(0 100% 0 0);
                  }
                  100% {
                    opacity: 1;
                    clip-path: inset(0 0% 0 0);
                  }
                }
                @keyframes headingScanLine {
                  0% {
                    left: 0%;
                    opacity: 0;
                  }
                  5% {
                    opacity: 1;
                  }
                  95% {
                    opacity: 1;
                  }
                  100% {
                    left: 100%;
                    opacity: 0;
                  }
                }
                @keyframes listScanLine {
                  0% {
                    left: 0%;
                    opacity: 0;
                  }
                  5% {
                    opacity: 1;
                  }
                  95% {
                    opacity: 1;
                  }
                  100% {
                    left: 100%;
                    opacity: 0;
                  }
                }
              `}</style>
            )}
          </div>
        </div>
      </div>
      
      {/* Responsive styling for TargetSquare in flex container */}
      <style>{`
        @media (min-width: 1024px) {
          .target-square-container {
            /* Align TargetSquare top with content (not heading) */
            align-items: flex-start;
          }
          
          .target-square {
            /* Fill 60% of available width in flex container */
            width: 60% !important;
            max-width: 220px;
            
            /* Maintain square aspect ratio */
            aspect-ratio: 1;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
