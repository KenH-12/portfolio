import React from "react";
import { PlanetVisual } from "../celestial/PlanetVisual";
import { Rings } from "../celestial/Rings";
import { RotatingSatellite } from "../celestial/RotatingSatellite";
import type { PlanetData } from "@/types/planet";

interface PlanetLegendProps {
  planets: PlanetData[];
  hoveredPlanetIndex?: number | null;
  onPlanetHover?: (index: number | null) => void;
  onPlanetClick?: (planetLabel: string) => void;
  isTransitioning?: boolean;
  showExperience?: boolean;
  showProjects?: boolean;
  showTestimonials?: boolean;
  showEducation?: boolean;
  showAboutMe?: boolean;
  showContact?: boolean;
  contactExiting?: boolean;
  isOnHero?: boolean;
}

export function PlanetLegend({ planets, hoveredPlanetIndex, onPlanetHover, onPlanetClick, isTransitioning = false, showExperience = false, showProjects = false, showTestimonials = false, showEducation = false, showAboutMe = false, showContact = false, contactExiting = false, isOnHero = false }: PlanetLegendProps) {
  // Find the maximum planet size for alignment
  const maxPlanetSize = Math.max(...planets.map((p) => p.size));
  const planetContainerWidth = maxPlanetSize + 8; // Add padding for glow effect
  
  // Find the maximum label width (approximate based on text length)
  // Using a fixed width based on the longest label - increased for larger text
  const maxLabelWidth = Math.max(...planets.map((p) => p.label.length)) * 12 + 48; // Approximate width calculation
  
  // Check if any planet is hovered (for expanded state) - including active planets
  // Keep expanded when on Hero section
  const isExpanded = isOnHero || (hoveredPlanetIndex !== null && hoveredPlanetIndex !== undefined);
  
  // Determine which section is active (for blur effect)
  const activeSectionId = 
    showEducation ? 'education-section' :
    showTestimonials ? 'testimonials-section' :
    showProjects ? 'projects-section' :
    showExperience ? 'experience-section' :
    showAboutMe ? 'about-me-section' :
    null;
  
  // Apply blur to active section and FocusedPlanet when expanded (but not on Hero)
  React.useEffect(() => {
    if (isExpanded && activeSectionId && !isOnHero) {
      // Add blur class to active section
      const sectionElement = document.getElementById(activeSectionId);
      if (sectionElement) {
        sectionElement.classList.add('planet-legend-blurred');
      }
      
      // Add blur class to FocusedPlanet
      const focusedPlanets = document.querySelectorAll('.focused-planet');
      focusedPlanets.forEach(planet => {
        planet.classList.add('planet-legend-blurred');
      });
    } else {
      // Remove blur from all sections
      ['experience-section', 'projects-section', 'testimonials-section', 'education-section', 'about-me-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('planet-legend-blurred');
        }
      });
      
      // Remove blur from all FocusedPlanets
      const focusedPlanets = document.querySelectorAll('.focused-planet');
      focusedPlanets.forEach(planet => {
        planet.classList.remove('planet-legend-blurred');
      });
    }
    
    return () => {
      // Cleanup on unmount
      ['experience-section', 'projects-section', 'testimonials-section', 'education-section', 'about-me-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('planet-legend-blurred');
        }
      });
      
      const focusedPlanets = document.querySelectorAll('.focused-planet');
      focusedPlanets.forEach(planet => {
        planet.classList.remove('planet-legend-blurred');
      });
    };
  }, [isExpanded, activeSectionId, isOnHero]);
  
  return (
    <div 
      className={`flex flex-col gap-4 pl-4 planet-legend-container ${isExpanded ? 'planet-legend-expanded' : ''}`}
      style={{
        '--button-base-width': `${maxLabelWidth}px`,
      } as React.CSSProperties}
      onMouseLeave={() => onPlanetHover?.(null)}
    >
      {planets.map((planet, index) => {
        // Determine if this planet's section is active
        const isActive = 
          (planet.label === "Experience" && showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe) ||
          (planet.label === "Projects" && showProjects && !showTestimonials && !showEducation && !showAboutMe) ||
          (planet.label === "Testimonials" && showTestimonials && !showEducation && !showAboutMe) ||
          (planet.label === "Education" && showEducation && !showAboutMe) ||
          (planet.label === "About Me" && showAboutMe);
        
        // Determine if this planet's section is transitioning
        const isTransitioningToThis = isTransitioning && (
          (planet.label === "Experience" && showExperience) ||
          (planet.label === "Projects" && showProjects) ||
          (planet.label === "Testimonials" && showTestimonials) ||
          (planet.label === "Education" && showEducation) ||
          (planet.label === "About Me" && showAboutMe)
        );
        
        const isDisabled = isActive || isTransitioningToThis || isTransitioning;
        // Allow hover on active planets for legend expansion, but keep them disabled for clicking
        const canHover = !isTransitioningToThis && !isTransitioning;
        
        return (
        <div
          key={index}
          className="flex items-center"
        >
          {/* Motionless planet - fixed width container for alignment */}
          <div
            className="flex-shrink-0 flex items-center justify-center relative"
            style={{
              width: `${planetContainerWidth}px`,
              marginRight: "4px",
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            data-hoverable
            onMouseEnter={() => canHover && onPlanetHover?.(index)}
            onClick={() => {
              if (isExpanded) {
                onPlanetHover?.(null);
              }
              if (!isDisabled) {
                onPlanetClick?.(planet.label);
              }
            }}
          >
            <div className="relative">
              <PlanetVisual
                size={planet.size}
                gradientColors={planet.gradientColors}
                glowColor={planet.glowColor}
                hasTexture={planet.hasTexture}
                textureName={planet.textureName}
                textureRotationSpeed={planet.textureRotationSpeed}
                textureRotationAngle={planet.textureRotationAngle}
                isPulsating={hoveredPlanetIndex === index && !isDisabled}
              />
              {planet.hasRings && (
                <Rings
                  gradientColors={planet.gradientColors}
                  ringRadius={planet.ringRadius}
                  ringTiltAngle={planet.ringTiltAngle}
                  size={planet.size}
                />
              )}
            </div>
          </div>
          
          {/* Horizontal line connector - matches button border color */}
          <div
            className="flex-shrink-0 planet-legend-connector relative overflow-hidden"
            style={{
              width: "24px",
              height: "2px",
              background: isActive ? "hsla(174, 72%, 56%, 0.6)" : "hsla(174, 72%, 56%, 0.3)",
              '--connector-width': '24px',
            } as React.CSSProperties}
          >
            {/* Scan line for connector */}
            <span 
              className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none planet-legend-scanline"
              style={{
                width: '2px',
                height: '100%',
                boxShadow: '0 0 8px hsla(174, 72%, 56%, 0.8), 0 0 15px hsla(174, 72%, 56%, 0.4)',
            }}
          />
          </div>
          
          {/* Button - responsive width */}
          <button
            type="button"
            disabled={isDisabled}
            className="inline-flex items-center justify-center border font-medium relative overflow-hidden transition-all duration-300 group planet-legend-button"
            data-hoverable
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              position: "relative",
              background: isActive 
                ? "hsla(174, 72%, 56%, 0.4)" 
                : hoveredPlanetIndex === index && !isDisabled
                ? "hsla(174, 72%, 56%, 0.2)" 
                : "hsla(174, 72%, 56%, 0.08)",
              backdropFilter: "blur(4px)",
              borderColor: isActive 
                ? "hsla(174, 72%, 56%, 0.8)" 
                : "hsla(174, 72%, 56%, 0.3)",
              borderStyle: "solid",
              borderWidth: isActive ? "2px" : "1px",
              color: isActive 
                ? "hsla(174, 72%, 90%, 1)" 
                : isDisabled
                ? "hsla(174, 72%, 56%, 0.5)"
                : "hsla(174, 72%, 70%, 0.9)",
              boxShadow: isActive
                ? `
                  inset 0 0 30px hsla(174, 72%, 56%, 0.2),
                  0 0 20px hsla(174, 72%, 56%, 0.3),
                  0 0 40px hsla(174, 72%, 56%, 0.2)
                `
                : `
                  inset 0 0 20px hsla(174, 72%, 56%, 0.08),
                  0 0 10px hsla(174, 72%, 56%, 0.15),
                  0 0 20px hsla(174, 72%, 56%, 0.08)
                `,
              textShadow: isActive
                ? `
                  0 0 8px hsla(174, 72%, 90%, 0.8),
                  0 0 15px hsla(174, 72%, 90%, 0.5),
                  0 0 25px hsla(174, 72%, 90%, 0.3)
                `
                : `
                  0 0 5px hsla(174, 72%, 70%, 0.6),
                  0 0 10px hsla(174, 72%, 70%, 0.3),
                  0 0 15px hsla(174, 72%, 70%, 0.15)
                `,
              // Reset default button styles
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled && !isActive ? 0.5 : 1,
            }}
            onMouseEnter={() => {
              if (canHover) {
                onPlanetHover?.(index);
              }
            }}
            onClick={() => {
              if (isExpanded) {
                onPlanetHover?.(null);
              }
              if (!isDisabled) {
                onPlanetClick?.(planet.label);
              }
            }}
          >
            {/* Irregular retro-futuristic grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `
                  linear-gradient(45deg, hsla(174, 72%, 56%, 0.15) 1px, transparent 1px),
                  linear-gradient(-45deg, hsla(174, 72%, 56%, 0.12) 1px, transparent 1px),
                  linear-gradient(0deg, hsla(174, 72%, 56%, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, hsla(174, 72%, 56%, 0.1) 1px, transparent 1px)
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
                animation: "gridShift 3s linear infinite",
              }}
            />
            {/* Scanline overlay for CRT effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    hsla(174, 72%, 56%, 0.08) 2px,
                    hsla(174, 72%, 56%, 0.08) 4px
                  )
                `,
              }}
            />
            {/* Subtle screen glow */}
            <div
              className="absolute inset-0 pointer-events-none"
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
            {/* Scan line for button */}
            <span 
              className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none planet-legend-scanline z-20"
              style={{
                width: '3px',
                height: '100%',
                boxShadow: '0 0 15px hsla(174, 72%, 56%, 0.8), 0 0 30px hsla(174, 72%, 56%, 0.4)',
              }}
            />
            <span className="relative z-10">{planet.label}</span>
          </button>
        </div>
      )})}
      
      {/* Contact row - telescope image, same hover/active behavior as planet rows; disabled during transition */}
      {(() => {
        const contactIndex = planets.length;
        const isContactHovered = hoveredPlanetIndex === contactIndex;
        const isContactDisabled = isTransitioning;
        const isContactActive = showContact && !contactExiting;
        return (
      <div
        className="flex items-center"
        onMouseEnter={() => !isContactDisabled && onPlanetHover?.(contactIndex)}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center relative"
          style={{
            width: `${planetContainerWidth}px`,
            marginRight: "4px",
            cursor: isContactDisabled ? "not-allowed" : "pointer",
          }}
          data-hoverable
          onClick={() => {
            if (isContactDisabled) return;
            if (isExpanded) onPlanetHover?.(null);
            onPlanetClick?.("Contact");
          }}
        >
          <RotatingSatellite style={{ width: "100%", height: maxPlanetSize }}>
            <img
              src="/images/space-satellite.png"
              alt="Contact"
              className="object-contain w-full h-full"
            />
          </RotatingSatellite>
        </div>
        <div
          className="flex-shrink-0 planet-legend-connector relative overflow-hidden"
          style={{
            width: "24px",
            height: "2px",
            background: isContactActive ? "hsla(174, 72%, 56%, 0.6)" : "hsla(174, 72%, 56%, 0.3)",
            '--connector-width': '24px',
          } as React.CSSProperties}
        >
          <span
            className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none planet-legend-scanline"
            style={{
              width: '2px',
              height: '100%',
              boxShadow: '0 0 8px hsla(174, 72%, 56%, 0.8), 0 0 15px hsla(174, 72%, 56%, 0.4)',
            }}
          />
        </div>
        <button
          type="button"
          disabled={isContactDisabled}
          className="inline-flex items-center justify-center border font-medium relative overflow-hidden transition-all duration-300 group planet-legend-button"
          data-hoverable
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            position: "relative",
            background: isContactActive
              ? "hsla(174, 72%, 56%, 0.4)"
              : isContactHovered && !isContactDisabled
              ? "hsla(174, 72%, 56%, 0.2)"
              : "hsla(174, 72%, 56%, 0.08)",
            backdropFilter: "blur(4px)",
            borderColor: isContactActive ? "hsla(174, 72%, 56%, 0.8)" : "hsla(174, 72%, 56%, 0.3)",
            borderStyle: "solid",
            borderWidth: isContactActive ? "2px" : "1px",
            color: isContactActive
              ? "hsla(174, 72%, 90%, 1)"
              : isContactDisabled
              ? "hsla(174, 72%, 56%, 0.5)"
              : "hsla(174, 72%, 70%, 0.9)",
            boxShadow: isContactActive
              ? `
                inset 0 0 30px hsla(174, 72%, 56%, 0.2),
                0 0 20px hsla(174, 72%, 56%, 0.3),
                0 0 40px hsla(174, 72%, 56%, 0.2)
              `
              : `
                inset 0 0 20px hsla(174, 72%, 56%, 0.08),
                0 0 10px hsla(174, 72%, 56%, 0.15),
                0 0 20px hsla(174, 72%, 56%, 0.08)
              `,
            textShadow: isContactActive
              ? `
                0 0 8px hsla(174, 72%, 90%, 0.8),
                0 0 15px hsla(174, 72%, 90%, 0.5),
                0 0 25px hsla(174, 72%, 90%, 0.3)
              `
              : `
                0 0 5px hsla(174, 72%, 70%, 0.6),
                0 0 10px hsla(174, 72%, 70%, 0.3),
                0 0 15px hsla(174, 72%, 70%, 0.15)
              `,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            outline: "none",
            cursor: isContactDisabled ? "not-allowed" : "pointer",
            opacity: isContactDisabled && !isContactActive ? 0.5 : 1,
          }}
          onClick={() => {
            if (isContactDisabled) return;
            if (isExpanded) onPlanetHover?.(null);
            onPlanetClick?.("Contact");
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `
                linear-gradient(45deg, hsla(174, 72%, 56%, 0.15) 1px, transparent 1px),
                linear-gradient(-45deg, hsla(174, 72%, 56%, 0.12) 1px, transparent 1px),
                linear-gradient(0deg, hsla(174, 72%, 56%, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, hsla(174, 72%, 56%, 0.1) 1px, transparent 1px)
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
              animation: "gridShift 3s linear infinite",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  hsla(174, 72%, 56%, 0.08) 2px,
                  hsla(174, 72%, 56%, 0.08) 4px
                )
              `,
            }}
          />
          <span
            className="absolute top-0 left-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none planet-legend-scanline z-20"
            style={{
              width: '3px',
              height: '100%',
              boxShadow: '0 0 15px hsla(174, 72%, 56%, 0.8), 0 0 30px hsla(174, 72%, 56%, 0.4)',
            }}
          />
          <span className="relative z-10">Contact</span>
        </button>
      </div>
        );
      })()}
      
      <style>{`
        @keyframes gridShift {
          0% {
            background-position: 0 0, 4px 4px, 2px 2px, 1px 1px;
          }
          100% {
            background-position: 18px 18px, 26px 26px, 16px 16px, 17px 17px;
          }
        }
        
        /* Collapsed/Expanded behavior for 1024px-1440px */
        @media (min-width: 1024px) and (max-width: 1440px) {
          .planet-legend-container {
            transition: background-color 0.1s linear;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid hsla(174, 72%, 56%, 0.3);
          }
          
          .planet-legend-container:not(.planet-legend-expanded) {
            background-color: transparent;
            border: none;
          }
          
          .planet-legend-container.planet-legend-expanded {
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            padding-right: 1rem;
          }
          
          .planet-legend-connector {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          
          .planet-legend-button {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          
          /* Responsive widths when expanded */
          .planet-legend-container.planet-legend-expanded .planet-legend-connector {
            animation: legendReveal 0.4s linear forwards;
            /* Responsive width: scales from 18px at 1024px to 24px at 1440px */
            width: clamp(18px, calc(18px + 6px * ((100vw - 1024px) / 416)), 24px) !important;
          }
          
          .planet-legend-container.planet-legend-expanded .planet-legend-button {
            animation: legendReveal 0.4s linear forwards;
            /* Responsive width: scales from 75% at 1024px to 100% at 1440px of base width */
            /* All buttons use the same base width from container for alignment */
            /* Formula: 75% + (25% * progress) where progress = (viewport - 1024) / 416 */
            width: calc(var(--button-base-width) * (0.75 + 0.25 * ((100vw - 1024px) / 416))) !important;
            /* Clamp the result between 75% and 100% */
            min-width: calc(var(--button-base-width) * 0.75) !important;
            max-width: var(--button-base-width) !important;
          }
          
          .planet-legend-container.planet-legend-expanded .planet-legend-scanline {
            animation: legendScanLine 0.4s linear forwards;
          }
          
          /* Reset when collapsed */
          .planet-legend-container:not(.planet-legend-expanded) .planet-legend-connector,
          .planet-legend-container:not(.planet-legend-expanded) .planet-legend-button {
            animation: none;
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          
          .planet-legend-container:not(.planet-legend-expanded) .planet-legend-scanline {
            animation: none;
            left: 0%;
            opacity: 0;
          }
        }
        
        @keyframes legendReveal {
          0% {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0% 0 0);
          }
        }
        
        @keyframes legendScanLine {
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
        
        /* Blur active section when legend is expanded */
        @media (min-width: 1024px) and (max-width: 1440px) {
          .planet-legend-blurred {
            filter: blur(4px);
            transition: filter 0.3s ease-in-out;
          }
        }
        
        /* Fixed width for buttons and connectors beyond 1440px */
        @media (min-width: 1441px) {
          /* Buttons are always visible beyond 1440px, so set fixed width */
          .planet-legend-button {
            width: var(--button-base-width) !important;
          }
          
          .planet-legend-connector {
            width: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
