import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlanetVisual } from "../celestial/PlanetVisual";
import { Rings } from "../celestial/Rings";
import { RotatingSatellite } from "../celestial/RotatingSatellite";
import { Star } from "../celestial/Star";
import type { PlanetData } from "@/types/planet";

interface MobileSidebarProps {
  planets: PlanetData[];
  hoveredPlanetIndex: number | null;
  onPlanetHover: (index: number | null) => void;
  onPlanetClick: (planetLabel: string) => void;
  onHeroClick?: () => void;
  isTransitioning?: boolean;
  showExperience?: boolean;
  showProjects?: boolean;
  showTestimonials?: boolean;
  showEducation?: boolean;
  showAboutMe?: boolean;
}

export function MobileSidebar({
  planets,
  hoveredPlanetIndex,
  onPlanetHover,
  onPlanetClick,
  onHeroClick,
  isTransitioning = false,
  showExperience = false,
  showProjects = false,
  showTestimonials = false,
  showEducation = false,
  showAboutMe = false,
}: MobileSidebarProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handlePlanetClick = (planetLabel: string) => {
    // On mobile/tablet, scroll to section instead of triggering transition
    if (isMobile) {
      const sectionMap: Record<string, string> = {
        'About Me': 'about-me-section',
        'Experience': 'experience-section',
        'Projects': 'projects-section',
        'Testimonials': 'testimonials-section',
        'Education': 'education-section',
        'Contact': 'contact-section',
      };
      
      const sectionId = sectionMap[planetLabel];
      if (sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setSidebarOpen(false);
          return;
        }
      }
    }
    
    // On desktop, use the transition
    onPlanetClick?.(planetLabel);
    setSidebarOpen(false);
  };
  
  const handleHeroClick = () => {
    // On mobile/tablet, scroll to top of page instead of triggering transition
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSidebarOpen(false); // Close sidebar when hero is clicked
      return;
    }
    
    // On desktop, use the transition
    const isOnHero = !showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe;
    if (!isOnHero && !isTransitioning) {
      onHeroClick?.();
      setSidebarOpen(false); // Close sidebar when hero is clicked
    }
  };
  
  // Track which section is currently in view on mobile
  const [activeSectionInView, setActiveSectionInView] = useState<string | null>(null);

  // Detect which section is in view when sidebar opens on mobile
  useEffect(() => {
    if (!isMobile || !sidebarOpen) {
      return;
    }

    const detectActiveSection = () => {
      const sections = [
        { id: 'hero-section', name: 'hero' },
        { id: 'about-me-section', name: 'aboutme' },
        { id: 'experience-section', name: 'experience' },
        { id: 'projects-section', name: 'projects' },
        { id: 'testimonials-section', name: 'testimonials' },
        { id: 'education-section', name: 'education' },
        { id: 'contact-section', name: 'contact' },
      ];

      // Find the section that is most visible in the viewport
      let maxVisible = 0;
      let activeSection: string | null = null;

      sections.forEach(({ id, name }) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calculate how much of the section is visible
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibleRatio = visibleHeight / viewportHeight;

          // If this section has more visible area, it's the active one
          // Also prioritize sections that are at least 30% visible and near the top
          if (visibleRatio > maxVisible || (visibleRatio > 0.3 && rect.top < viewportHeight * 0.5)) {
            maxVisible = visibleRatio;
            activeSection = name;
          }
        }
      });

      // If we're at the very top, it's the hero section
      if (window.scrollY < 100) {
        activeSection = 'hero';
      }

      setActiveSectionInView(activeSection);
    };

    // Check immediately when sidebar opens
    detectActiveSection();

    // Also check on scroll while sidebar is open
    const handleScroll = () => {
      detectActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, sidebarOpen]);
  
  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTitle className="sr-only">Navigation</SheetTitle>
      <SheetTrigger asChild>
        <button
          className="fixed z-[100] top-1 left-1 p-1"
          data-hoverable
          style={{
            pointerEvents: 'auto',
          }}
        >
          <Menu className="h-7 w-7 text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-6 bg-background/95 backdrop-blur-lg border-r border-primary/20 overflow-y-auto">
        <div className="flex flex-col gap-1 mt-8">
          {/* Hero button with Sun representation */}
          <button
            type="button"
            onClick={handleHeroClick}
            className="flex items-center gap-4 p-2 border transition-all duration-300 group relative overflow-hidden"
            data-hoverable
            style={{
              background: activeSectionInView === 'hero'
                ? "hsla(174, 72%, 56%, 0.4)" 
                : "hsla(174, 72%, 56%, 0.08)",
              backdropFilter: "blur(4px)",
              borderColor: activeSectionInView === 'hero'
                ? "hsla(174, 72%, 56%, 0.8)" 
                : "hsla(174, 72%, 56%, 0.3)",
              borderWidth: activeSectionInView === 'hero' ? "2px" : "1px",
              color: activeSectionInView === 'hero'
                ? "hsla(174, 72%, 90%, 1)" 
                : "hsla(174, 72%, 70%, 0.9)",
              opacity: 1,
              pointerEvents: "auto",
            }}
          >
            {/* Sun representation with passive glow */}
            <div className="flex-shrink-0 relative flex items-center justify-center" style={{ width: '44px', height: '44px', overflow: 'visible' }}>
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'radial-gradient(circle, rgba(255, 220, 100, 0.4) 0%, rgba(255, 220, 100, 0.2) 50%, transparent 70%)',
                  filter: 'blur(8px)',
                  animation: 'starGlow 2s ease-in-out infinite',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Star coreSize={30} starColor="yellow" textureRotationSpeed={20} />
              </div>
              <style>{`
                @keyframes starGlow {
                  0%, 100% {
                    opacity: 0.6;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.8;
                    transform: scale(1.1);
                  }
                }
              `}</style>
            </div>
            
            {/* Label */}
            <span 
              className="text-base font-medium uppercase tracking-wider"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                textShadow: activeSectionInView === 'hero'
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
              }}
            >
              Ken Henderson
            </span>
            
            {/* Grid pattern overlay */}
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
              }}
            />
          </button>
          
          {planets.map((planet, index) => {
            // Map planet labels to section names
            const sectionNameMap: Record<string, string> = {
              'Experience': 'experience',
              'Projects': 'projects',
              'Education': 'education',
              'Testimonials': 'testimonials',
              'About Me': 'aboutme',
            };
            
            const sectionName = sectionNameMap[planet.label];
            
            // On mobile, use activeSectionInView; on desktop, use the transition state
            const isActive = isMobile
              ? activeSectionInView === sectionName
              : (planet.label === "Experience" && showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe) ||
                (planet.label === "Projects" && showProjects && !showTestimonials && !showEducation && !showAboutMe) ||
                (planet.label === "Testimonials" && showTestimonials && !showEducation && !showAboutMe) ||
                (planet.label === "Education" && showEducation && !showAboutMe) ||
                (planet.label === "About Me" && showAboutMe);
            
            // Determine if this planet's section is transitioning (desktop only)
            const isTransitioningToThis = !isMobile && isTransitioning && (
              (planet.label === "Experience" && showExperience) ||
              (planet.label === "Projects" && showProjects) ||
              (planet.label === "Testimonials" && showTestimonials) ||
              (planet.label === "Education" && showEducation) ||
              (planet.label === "About Me" && showAboutMe)
            );
            
            const isDisabled = !isMobile && (isActive || isTransitioningToThis || isTransitioning);
            
            return (
              <button
                key={index}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    handlePlanetClick(planet.label);
                  }
                }}
                className="flex items-center gap-4 p-4 border transition-all duration-300 group relative overflow-hidden"
                data-hoverable
                style={{
                  background: isActive 
                    ? "hsla(174, 72%, 56%, 0.4)" 
                    : "hsla(174, 72%, 56%, 0.08)",
                  backdropFilter: "blur(4px)",
                  borderColor: isActive 
                    ? "hsla(174, 72%, 56%, 0.8)" 
                    : "hsla(174, 72%, 56%, 0.3)",
                  borderWidth: isActive ? "2px" : "1px",
                  color: isActive 
                    ? "hsla(174, 72%, 90%, 1)" 
                    : isDisabled
                    ? "hsla(174, 72%, 56%, 0.5)"
                    : "hsla(174, 72%, 70%, 0.9)",
                  opacity: isDisabled && !isActive ? 0.5 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  pointerEvents: isDisabled ? "none" : "auto",
                }}
                onMouseEnter={() => {
                  if (!isDisabled) {
                    onPlanetHover?.(index);
                  }
                }}
                onMouseLeave={() => {
                  onPlanetHover?.(null);
                }}
              >
                {/* Planet representation */}
                <div className="flex-shrink-0 relative">
                  <PlanetVisual
                    size={30}
                    gradientColors={planet.gradientColors}
                    glowColor={planet.glowColor}
                    hasTexture={planet.hasTexture}
                    textureName={planet.textureName}
                    textureRotationSpeed={planet.textureRotationSpeed}
                    textureRotationAngle={planet.textureRotationAngle}
                    isPulsating={hoveredPlanetIndex === index && !isDisabled && !isActive}
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
                
                {/* Label */}
                <span 
                  className="text-base font-medium uppercase tracking-wider"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
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
                  }}
                >
                  {planet.label}
                </span>
                
                {/* Grid pattern overlay */}
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
                  }}
                />
              </button>
            );
          })}
          
          {/* Contact button */}
          <button
            type="button"
            onClick={() => handlePlanetClick("Contact")}
            className="flex items-center gap-4 p-4 border transition-all duration-300 group relative overflow-hidden"
            data-hoverable
            style={{
              background: activeSectionInView === "contact"
                ? "hsla(174, 72%, 56%, 0.4)"
                : "hsla(174, 72%, 56%, 0.08)",
              backdropFilter: "blur(4px)",
              borderColor: activeSectionInView === "contact"
                ? "hsla(174, 72%, 56%, 0.8)"
                : "hsla(174, 72%, 56%, 0.3)",
              borderWidth: activeSectionInView === "contact" ? "2px" : "1px",
              color: activeSectionInView === "contact"
                ? "hsla(174, 72%, 90%, 1)"
                : "hsla(174, 72%, 70%, 0.9)",
              opacity: 1,
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <div className="flex-shrink-0 relative" style={{ width: 30, height: 30 }}>
              <RotatingSatellite style={{ width: 30, height: 30 }}>
                <img
                  src="/images/space-satellite.png"
                  alt=""
                  className="object-contain w-full h-full"
                />
              </RotatingSatellite>
            </div>
            <span
              className="text-base font-medium uppercase tracking-wider"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                textShadow: activeSectionInView === "contact"
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
              }}
            >
              Contact
            </span>
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
              }}
            />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
