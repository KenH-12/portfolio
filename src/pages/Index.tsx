import React, { useState, useRef, useEffect } from "react";
import { Hero, planets } from "@/components/sections/Hero";
import { Experience, MobileExperience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Testimonials, MobileTestimonials } from "@/components/sections/Testimonials";
import { Education, MobileEducation } from "@/components/sections/Education";
import { AboutMe, MobileAboutMe } from "@/components/sections/AboutMe";
import {
  Contact,
  ContactOverlay,
  CONTACT_OVERLAY_DELAY_MS,
  CONTACT_OVERLAY_TRANSITION_MS,
} from "@/components/sections/Contact";
import { StarrySky } from "@/components/celestial/StarrySky";
import { FocusedPlanet } from "@/components/celestial/FocusedPlanet";
import { PlanetProjection } from "@/components/celestial/PlanetProjection";
import { AppLayout } from "@/components/layout/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { HERO_INTRO_DURATIONS } from "@/lib/heroIntro";

// Section linked list structure; planetIndex derived from planets so order stays in sync
type SectionName = 'Hero' | 'AboutMe' | 'Experience' | 'Projects' | 'Testimonials' | 'Education';

interface Section {
  name: SectionName;
  planetIndex: number | null; // null for Hero
  targetSelector: string | null; // null for Hero
  setShowSection: ((show: boolean) => void) | null; // null for Hero
}

const SECTIONS: Section[] = [
  { name: 'Hero', planetIndex: null, targetSelector: null, setShowSection: null },
  { name: 'AboutMe', planetIndex: planets.findIndex((p) => p.label === 'About Me'), targetSelector: '#about-me-section [data-planet-target]', setShowSection: null },
  { name: 'Experience', planetIndex: planets.findIndex((p) => p.label === 'Experience'), targetSelector: '#experience-section [data-planet-target]', setShowSection: null },
  { name: 'Projects', planetIndex: planets.findIndex((p) => p.label === 'Projects'), targetSelector: '#projects-section [data-planet-target]', setShowSection: null },
  { name: 'Testimonials', planetIndex: planets.findIndex((p) => p.label === 'Testimonials'), targetSelector: '#testimonials-section [data-planet-target]', setShowSection: null },
  { name: 'Education', planetIndex: planets.findIndex((p) => p.label === 'Education'), targetSelector: '#education-section [data-planet-target]', setShowSection: null },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [introComplete, setIntroComplete] = useState(false);
  // Delay root background switch to avoid flash when intro completes (Star/solar repaint)
  const [rootBackgroundReady, setRootBackgroundReady] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactExiting, setContactExiting] = useState(false);
  const [contactOverlayReady, setContactOverlayReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [isPlanetReturning, setIsPlanetReturning] = useState(false);
  const [showOriginalPlanet, setShowOriginalPlanet] = useState(false);
  const [shouldMoveSolarSystemBack, setShouldMoveSolarSystemBack] = useState(false);
  const [planetStartPosition, setPlanetStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [planetEndPosition, setPlanetEndPosition] = useState<{ x: number; y: number } | null>(null);
  const [planetEndSize, setPlanetEndSize] = useState<number>(300); // Responsive end size
  const [activePlanetIndex, setActivePlanetIndex] = useState<number | null>(null);
  const [hoveredPlanetIndex, setHoveredPlanetIndex] = useState<number | null>(null);
  const [sectionLocked, setSectionLocked] = useState(false);
  const [originalPlanetPosition, setOriginalPlanetPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTransitionTimeRef = useRef<number>(0);
  const handleReverseTransitionRef = useRef<(() => void) | null>(null);

  
  // Determine if any section is shown
  const isAnySectionShown = showExperience || showProjects || showTestimonials || showEducation || showAboutMe;
  
  // Hide square immediately when reversing (going back to Hero), otherwise use normal logic
  const shouldShowSquare = isAnySectionShown && !isTransitioning && !isReversing;

  // Helper function to get current section based on state
  const getCurrentSection = (): SectionName => {
    if (showEducation) return 'Education';
    if (showTestimonials) return 'Testimonials';
    if (showProjects) return 'Projects';
    if (showExperience) return 'Experience';
    if (showAboutMe) return 'AboutMe';
    return 'Hero';
  };

  // Helper function to get next section in the linked list
  const getNextSection = (current: SectionName): SectionName => {
    const currentIndex = SECTIONS.findIndex(s => s.name === current);
    const nextIndex = (currentIndex + 1) % SECTIONS.length;
    return SECTIONS[nextIndex].name;
  };

  // Helper function to get previous section in the linked list
  const getPreviousSection = (current: SectionName): SectionName => {
    const currentIndex = SECTIONS.findIndex(s => s.name === current);
    const prevIndex = currentIndex === 0 ? SECTIONS.length - 1 : currentIndex - 1;
    return SECTIONS[prevIndex].name;
  };

  // Intro is CSS-driven; set introComplete once after full sequence so we don't re-run intro
  useEffect(() => {
    const totalMs =
      HERO_INTRO_DURATIONS.SOLAR_SCALE_DELAY_MS +
      HERO_INTRO_DURATIONS.LIGHTSPEED_MS +
      HERO_INTRO_DURATIONS.CONTENT_MS;
    const t = setTimeout(() => setIntroComplete(true), totalMs);
    return () => clearTimeout(t);
  }, []);

  // Apply root background (bg-background) after intro + short delay to avoid Star flash from repaint
  useEffect(() => {
    if (!introComplete) return;
    const t = setTimeout(() => setRootBackgroundReady(true), 120);
    return () => clearTimeout(t);
  }, [introComplete]);

  // When Contact overlay entrance animation is complete, mark ready (for scroll-up binding)
  useEffect(() => {
    if (!showContact || contactExiting) {
      setContactOverlayReady(false);
      return;
    }
    const readyMs = CONTACT_OVERLAY_DELAY_MS + CONTACT_OVERLAY_TRANSITION_MS;
    const id = setTimeout(() => setContactOverlayReady(true), readyMs);
    return () => clearTimeout(id);
  }, [showContact, contactExiting]);

  // Bind scroll-up to reverse Contact transition when overlay is visible (desktop only)
  useEffect(() => {
    if (isMobile || !showContact || contactExiting || !contactOverlayReady) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        e.preventDefault();
        handleReverseTransitionRef.current?.();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isMobile, showContact, contactExiting, contactOverlayReady]);

  // Track original planet position when FocusedPlanet is active
  useEffect(() => {
    if (activePlanetIndex === null || !containerRef.current) {
      setOriginalPlanetPosition(null);
      return;
    }

    const updateOriginalPlanetPosition = () => {
      if (containerRef.current && activePlanetIndex !== null) {
        const planetElements = document.querySelectorAll('[data-hero-planet]');
        const originalPlanetElement = planetElements[activePlanetIndex] as HTMLElement;
        if (originalPlanetElement && containerRef.current) {
          const planetRect = originalPlanetElement.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const planetCenterX = planetRect.left + planetRect.width / 2;
          const planetCenterY = planetRect.top + planetRect.height / 2;
          const x = planetCenterX - containerRect.left;
          const y = planetCenterY - containerRect.top;
          setOriginalPlanetPosition({ x, y });
        }
      }
    };

    updateOriginalPlanetPosition();
    const interval = setInterval(updateOriginalPlanetPosition, 16); // ~60fps
    return () => {
      clearInterval(interval);
      setOriginalPlanetPosition(null);
    };
  }, [activePlanetIndex]);

  // Unified function to transition directly between any sections (always forward)
  const transitionToSection = (
    planetIndex: number,
    targetSelector: string,
    setShowSection: (show: boolean) => void,
    hideCurrentSections?: () => void
  ) => {
    if (!containerRef.current) return;

    // On mobile, skip planet animation and transition directly
    if (isMobile) {
      // Hide current sections first
      if (hideCurrentSections) {
        hideCurrentSections();
      }
      
      setIsTransitioning(true);
      setShowSection(true);
      
      // Reset transition state after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      return;
    }

    // Hide current sections first
    if (hideCurrentSections) {
      hideCurrentSections();
    }
    
    // Ensure solar system stays in "up" position for forward transitions
    setShouldMoveSolarSystemBack(false);
    
    // Calculate start position immediately (from orbiting planet) - this is always available
    let startPos: { x: number; y: number } | null = null;
    if (containerRef.current) {
      const planetElements = document.querySelectorAll('[data-hero-planet]');
      const planetElement = planetElements[planetIndex] as HTMLElement;
      if (planetElement) {
        const planetRect = planetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const planetCenterX = planetRect.left + planetRect.width / 2;
        const planetCenterY = planetRect.top + planetRect.height / 2;
        const x = planetCenterX - containerRect.left;
        const y = planetCenterY - containerRect.top;
        startPos = { x, y };
      }
    }
    
    // Set start position immediately so FocusedPlanet can render in correct position
    if (startPos) {
      setPlanetStartPosition(startPos);
    }
    
    // Set transitioning state and show section first to make TargetSquare visible and positioned
    setIsTransitioning(true);
    setActivePlanetIndex(planetIndex);
    setShowSection(true); // Show section so TargetSquare is in correct position
    
    // Extract section ID for later use
    const sectionId = targetSelector.match(/#([\w-]+)/)?.[1];
    
    // Calculate end position after TargetSquare becomes visible and section is in layout
    // Use multiple frames to ensure React has fully rendered the component
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Find section element after React has rendered
        const sectionElement = sectionId ? document.getElementById(sectionId) : null;
        
        // Temporarily force section to be fully visible (opacity: 1) for position calculation
        // This ensures the TargetSquare is in its final position when we measure it
        let originalTransition = '';
        let originalOpacity = '';
        if (sectionElement) {
          // Store original styles
          originalTransition = sectionElement.style.transition;
          originalOpacity = sectionElement.style.opacity;
          // Force immediate visibility for position calculation
          sectionElement.style.transition = 'none';
          sectionElement.style.opacity = '1';
        }
        
        // Third frame: wait for layout to update after forcing visibility
        requestAnimationFrame(() => {
        let endPos: { x: number; y: number } | null = null;

        // Capture end position from target element (now visible and positioned)
        // Query within the section container to ensure we get the correct TargetSquare
        // For sections with hidden lg:block wrapper, we need to query inside that wrapper
        const currentSectionElement = sectionId ? document.getElementById(sectionId) : null;
        let targetElement: HTMLElement | null = null;
        
        if (currentSectionElement) {
          // For sections with hidden lg:block wrapper (Experience, Testimonials, Education),
          // the TargetSquare is inside that wrapper. Try to find it there first.
          // Tailwind classes: 'hidden' and 'lg:block' (colon needs escaping in querySelector)
          const desktopWrapper = currentSectionElement.querySelector('[class*="hidden"][class*="lg:block"]') as HTMLElement;
          if (desktopWrapper) {
            targetElement = desktopWrapper.querySelector('[data-planet-target]') as HTMLElement;
          }
          // If not found in wrapper, try directly in section (for Projects which doesn't have wrapper)
          if (!targetElement) {
            targetElement = currentSectionElement.querySelector('[data-planet-target]') as HTMLElement;
          }
        }
        
        // Fallback to direct query using the targetSelector
        if (!targetElement) {
          targetElement = document.querySelector(targetSelector) as HTMLElement;
        }
          
        if (targetElement && containerRef.current) {
          const targetRect = targetElement.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const x = targetRect.left - containerRect.left + targetRect.width / 2;
          const y = targetRect.top - containerRect.top + targetRect.height / 2;
          endPos = { x, y };
          
          // Calculate responsive endSize based on TargetSquare's actual size
          // Use the smaller dimension to maintain square aspect, with min/max constraints
          const targetSize = Math.min(targetRect.width, targetRect.height);
          const responsiveEndSize = targetSize; // 80% of target size, clamped between 200-400px
          setPlanetEndSize(responsiveEndSize);
        } else {
          console.warn(`TargetSquare not found for section: ${sectionId}, selector: ${targetSelector}`);
        }

          // Restore section transition after position calculation
          if (sectionElement) {
            sectionElement.style.transition = originalTransition;
            sectionElement.style.opacity = originalOpacity;
          }

          // Set end position and start animation
          if (endPos) {
            setPlanetEndPosition(endPos);
          } else {
            // If position calculation failed, reset transition state
            setIsTransitioning(false);
            setActivePlanetIndex(null);
            setShowSection(false);
            setPlanetStartPosition(null);
            setPlanetEndSize(300); // Reset to default
          }
        });
      });
    });
  };

  const handlePlanetClick = (planetLabel: string) => {
    // Contact: on desktop use overlay transition; on mobile scroll into view
    if (planetLabel === "Contact") {
      if (isMobile) {
        document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Clear any other active section so only Contact is active; then open Contact
        setShowExperience(false);
        setShowProjects(false);
        setShowTestimonials(false);
        setShowEducation(false);
        setShowAboutMe(false);
        setShowContact(true);
      }
      return;
    }
    
    // Don't allow clicks during transitions or if section is already active
    if (isTransitioning || sectionLocked) return;
    
    // Don't allow clicking on already active sections
    if (planetLabel === "Experience" && showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe) return;
    if (planetLabel === "Projects" && showProjects && !showTestimonials && !showEducation && !showAboutMe) return;
    if (planetLabel === "Testimonials" && showTestimonials && !showEducation && !showAboutMe) return;
    if (planetLabel === "Education" && showEducation && !showAboutMe) return;
    if (planetLabel === "About Me" && showAboutMe) return;

    // Helper to hide all current sections
    const hideAllSections = () => {
      setShowExperience(false);
      setShowProjects(false);
      setShowTestimonials(false);
      setShowEducation(false);
      setShowAboutMe(false);
    };

    // Transition using planet index from shared planet data
    const planet = planets.find((p) => p.label === planetLabel);
    if (!planet) return;
    const targetSelectors: Record<string, string> = {
      'About Me': '#about-me-section [data-planet-target]',
      'Experience': '#experience-section [data-planet-target]',
      'Projects': '#projects-section [data-planet-target]',
      'Testimonials': '#testimonials-section [data-planet-target]',
      'Education': '#education-section [data-planet-target]',
    };
    const setters: Record<string, (show: boolean) => void> = {
      'About Me': setShowAboutMe,
      'Experience': setShowExperience,
      'Projects': setShowProjects,
      'Testimonials': setShowTestimonials,
      'Education': setShowEducation,
    };
    const targetSelector = targetSelectors[planetLabel];
    const setShowSection = setters[planetLabel];
    if (targetSelector && setShowSection) {
      transitionToSection(planet.index, targetSelector, setShowSection, hideAllSections);
    }
  };

  // Reset isTransitioning flag when transition completes and lock section
  useEffect(() => {
    if ((showExperience || showProjects || showTestimonials || showEducation || showAboutMe) && !isReversing) {
      // Reset isTransitioning after animation completes (1000ms + buffer)
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        // Lock the section for a minimum duration to prevent skipping
        setSectionLocked(true);
        lastTransitionTimeRef.current = Date.now();
        // Unlock after minimum pause (1200ms) to allow user to see the section
        setTimeout(() => {
          setSectionLocked(false);
        }, 1200);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [showExperience, showProjects, showTestimonials, showEducation, showAboutMe, isReversing]);


  // Handle reverse transition (Any section → Hero, or Contact overlay → Hero)
  const handleReverseTransition = () => {
    // If showing Contact overlay, run reverse: content/StarrySky return immediately; overlay slides down then unmounts
    if (showContact) {
      setShowContact(false);
      setContactExiting(true);
      setTimeout(() => setContactExiting(false), CONTACT_OVERLAY_TRANSITION_MS);
      return;
    }
    // Must be on a section (not Hero) and not already transitioning
    if ((!showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe) || isTransitioning || isReversing) return;

    // On mobile, skip planet animation and transition directly
    if (isMobile) {
      setIsTransitioning(true);
      setShowExperience(false);
      setShowProjects(false);
      setShowTestimonials(false);
      setShowEducation(false);
      setShowAboutMe(false);
      setHoveredPlanetIndex(null); // Clear hovered planet when returning to Hero
      
      // Reset transition state after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      return;
    }

    setIsReversing(true);
    setIsTransitioning(true);
    setShouldMoveSolarSystemBack(false); // Keep solar system in "up" position until planet returns

    const planetIndexToReturn = activePlanetIndex;
    if (planetIndexToReturn === null) return;

    const hideSectionByPlanetIndex = (idx: number) => {
      if (idx === 0) setShowExperience(false);
      else if (idx === 1) setShowProjects(false);
      else if (idx === 2) setShowEducation(false);
      else if (idx === 3) setShowTestimonials(false);
      else if (idx === 4) setShowAboutMe(false);
    };
    hideSectionByPlanetIndex(planetIndexToReturn);
    
    // Phase 1: Return duplicate planet back to original planet's position
    // Wait for the DOM to fully settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Capture the current position of the original planet in its orbit
          // The planet continues orbiting even when hidden (opacity: 0), so we need
          // to capture its up-to-date position right before animating the duplicate
          if (containerRef.current) {
            // Find the original planet element (it should be in the DOM with opacity: 0)
            const planetElements = document.querySelectorAll('[data-hero-planet]');
            const planetElement = planetElements[planetIndexToReturn] as HTMLElement;
            
            if (planetElement && containerRef.current) {
              // Capture the position right before starting the animation to ensure
              // we get the most up-to-date orbital position (planet continues orbiting)
              // The planet is still animating in its orbit even with opacity: 0
              const captureAndStartAnimation = () => {
                // Force a reflow to ensure all CSS transforms and orbital animations are applied
                void planetElement.offsetHeight;
                void containerRef.current!.offsetHeight;
                
                // Get the most up-to-date bounding rect (includes all current transforms and orbital position)
                const planetRect = planetElement.getBoundingClientRect();
                const containerRect = containerRef.current!.getBoundingClientRect();
                
                // Calculate the planet's center position relative to the container
                // The planet element is positioned with left-1/2 top-1/2, so its center
                // is at the center of the element's bounding box
                // This accounts for the current orbital position at this exact moment
                const planetCenterX = planetRect.left + planetRect.width / 2;
                const planetCenterY = planetRect.top + planetRect.height / 2;
                
                // Convert to container-relative coordinates
                const x = planetCenterX - containerRect.left;
                const y = planetCenterY - containerRect.top;
                
                // Set the position and start animation
                setPlanetStartPosition({ x, y });
                
                // Start the animation on the next frame to ensure position is set
                requestAnimationFrame(() => {
                  setIsPlanetReturning(true);
                });
              };
              
              // Capture position and start animation immediately
              captureAndStartAnimation();
              
              // After duplicate planet animation completes (300ms), show the original planet
              setTimeout(() => {
                setShowOriginalPlanet(true);
                
                // Phase 2: After planet fully returns, move solar system back
                // Wait for the full duplicate planet animation to complete (300ms + buffer)
                setTimeout(() => {
                  // Now allow the solar system to start moving back
                  setShouldMoveSolarSystemBack(true);
                  
                  // After solar system returns (1000ms), reset everything
                  setTimeout(() => {
                    setIsTransitioning(false);
                    setIsReversing(false);
                    setIsPlanetReturning(false);
                    setShowOriginalPlanet(false);
                    setShouldMoveSolarSystemBack(false);
                    setPlanetStartPosition(null);
                    setPlanetEndPosition(null);
                    setPlanetEndSize(300); // Reset to default
                    setActivePlanetIndex(null);
                    setHoveredPlanetIndex(null); // Clear hovered planet when returning to Hero
                    // Lock the section for a minimum duration to prevent skipping
                    setSectionLocked(true);
                    lastTransitionTimeRef.current = Date.now();
                    setTimeout(() => {
                      setSectionLocked(false);
                    }, 800);
                  }, 1000); // Wait for solar system to return (1000ms + 100ms buffer)
                }, 250); // Wait for duplicate planet animation to fully complete (300ms animation + 100ms buffer)
              }, 300); // Wait for duplicate planet animation to complete (300ms)
            }
          }
        });
      });
    });
  };
  handleReverseTransitionRef.current = handleReverseTransition;

  // Handle window resize - reposition active FocusedPlanet to the TargetSquare
  useEffect(() => {
    const handleResize = () => {
      // Only update when not mobile and FocusedPlanet is visible and paused (not transitioning)
      if (isMobile || activePlanetIndex === null || !containerRef.current || isTransitioning || isReversing) {
        return;
      }

      // Determine which section is currently active
      let currentSection: SectionName | null = null;
      if (showEducation) {
        currentSection = 'Education';
      } else if (showTestimonials) {
        currentSection = 'Testimonials';
      } else if (showProjects) {
        currentSection = 'Projects';
      } else if (showExperience) {
        currentSection = 'Experience';
      } else if (showAboutMe) {
        currentSection = 'AboutMe';
      }

      if (!currentSection) {
        return;
      }

      const section = SECTIONS.find(s => s.name === currentSection);
      if (!section || !section.targetSelector) {
        return;
      }

      // Use same target-finding logic as transition (for sections with hidden lg:block wrapper)
      const sectionId = section.targetSelector.match(/#([\w-]+)/)?.[1];
      const sectionElement = sectionId ? document.getElementById(sectionId) : null;
      let targetElement: HTMLElement | null = null;

      if (sectionElement) {
        const desktopWrapper = sectionElement.querySelector('[class*="hidden"][class*="lg:block"]') as HTMLElement;
        if (desktopWrapper) {
          targetElement = desktopWrapper.querySelector('[data-planet-target]') as HTMLElement;
        }
        if (!targetElement) {
          targetElement = sectionElement.querySelector('[data-planet-target]') as HTMLElement;
        }
      }
      if (!targetElement) {
        targetElement = document.querySelector(section.targetSelector) as HTMLElement;
      }

      if (targetElement && containerRef.current) {
        const targetRect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = targetRect.left - containerRect.left + targetRect.width / 2;
        const y = targetRect.top - containerRect.top + targetRect.height / 2;

        const targetSize = Math.min(targetRect.width, targetRect.height);

        setPlanetEndPosition({ x, y });
        setPlanetEndSize(targetSize);
      }
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    // Run once when effect runs with an active planet so position is correct after layout
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile, activePlanetIndex, showExperience, showProjects, showTestimonials, showEducation, showAboutMe, isTransitioning, isReversing]);

  // Trigger reverse animation when switching to mobile if solar system was not visible
  useEffect(() => {
    // Only trigger if we just switched to mobile (was desktop, now mobile)
    // and a section is currently shown (solar system would be in "up" position)
    const isAnySectionShownForMobile = showExperience || showProjects || showTestimonials || showEducation || showAboutMe;
    
    if (isMobile && isAnySectionShownForMobile && !isTransitioning && !isReversing) {
      // Trigger reverse animation to bring solar system back down
      setShouldMoveSolarSystemBack(true);
      
      // Reset after animation completes
      setTimeout(() => {
        setShouldMoveSolarSystemBack(false);
      }, 1000); // Match the transition duration
    }
  }, [isMobile, showExperience, showProjects, showTestimonials, showEducation, showAboutMe, isTransitioning, isReversing]);

  const introActive = !introComplete;
  const rootStyle = rootBackgroundReady
    ? undefined
    : { background: "radial-gradient(ellipse at top, hsl(222, 60%, 8%) 0%, hsl(222, 70%, 4%) 50%, hsl(222, 80%, 2%) 100%)" };

  return (
    <div
      className={`min-h-screen relative ${rootBackgroundReady ? "bg-background" : ""}`}
      style={rootStyle}
    >
      <StarrySky
        introActive={introActive}
        lightspeedDurationMs={HERO_INTRO_DURATIONS.LIGHTSPEED_MS}
        elongateForContact={!isMobile && showContact}
        showContact={showContact}
        contactExiting={contactExiting}
      />
      
      <div className="w-full min-[1920px]:max-w-[1920px] min-[1920px]:mx-auto relative">
        {/* Planet Legend Layout */}
        <AppLayout
          planets={planets}
          hoveredPlanetIndex={hoveredPlanetIndex}
          onPlanetHover={setHoveredPlanetIndex}
          onPlanetClick={handlePlanetClick}
          onHeroClick={handleReverseTransition}
          introActive={!introComplete}
          isTransitioning={isTransitioning}
          showExperience={showExperience}
          showProjects={showProjects}
          showTestimonials={showTestimonials}
          showEducation={showEducation}
          showAboutMe={showAboutMe}
          showContact={showContact}
          contactExiting={contactExiting}
        />

        {/* Desktop: Contact overlay (slide up into view; reverse: slide down then unmount) */}
        {!isMobile && (showContact || contactExiting) && (
          <ContactOverlay
            exiting={contactExiting}
            onBackClick={() => handleReverseTransitionRef.current?.()}
          />
        )}

        {/* Main Content - offset by sidebar width on desktop only */}
        <main className="lg:ml-20 min-h-screen relative z-10 min-[1920px]:max-w-full">
        <div ref={containerRef} className={`w-full relative ${
          isMobile 
            ? "min-h-screen" 
            : "lg:h-screen min-h-screen overflow-y-auto lg:overflow-visible"
        }`}>
          {/* Wrapper: viewport height on desktop; animates up and out when transitioning to Contact */}
          <div
            className="relative lg:min-h-screen"
            style={{
              transition: "transform 900ms ease-out",
              transform: !isMobile && showContact ? "translateY(-100vh)" : undefined,
            }}
          >
          {/* Hero Section */}
          <div
            id="hero-section"
            className={`w-full min-h-screen ${
              isMobile 
                ? "relative" 
                : "absolute inset-0"
            }`}
          >
            <Hero 
              introActive={!introComplete}
              isTransitioning={isTransitioning} 
              showExperience={showExperience}
              showProjects={showProjects}
              showTestimonials={showTestimonials}
              showEducation={showEducation}
              showAboutMe={showAboutMe}
              showContact={showContact}
              isReversing={isReversing}
              isPlanetReturning={isPlanetReturning}
              showOriginalPlanet={showOriginalPlanet}
              shouldMoveSolarSystemBack={shouldMoveSolarSystemBack}
              activePlanetIndex={activePlanetIndex}
              planetStartPosition={planetStartPosition}
              onPlanetHover={setHoveredPlanetIndex}
              hoveredPlanetIndex={hoveredPlanetIndex}
            />
          </div>
          
          {/* Experience Section */}
          <div
            id="experience-section"
            className={`w-full min-h-0 lg:min-h-full ${
              isMobile 
                ? "relative" 
                : "absolute inset-0 lg:inset-0"
            }`}
            style={isMobile ? {} : {
              opacity: showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe ? 1 : 0,
              transition: "opacity 1000ms ease-in-out",
              pointerEvents: showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe ? "auto" : "none",
            }}
          >
            {/* Mobile/Tablet Experience - shown on screens < 1024px */}
            <div className="lg:hidden">
              <MobileExperience isTransitioning={isTransitioning} showExperience={true} />
            </div>
            {/* Desktop Experience - shown on screens >= 1024px */}
            <div className="hidden lg:block">
              <Experience 
                isTransitioning={isTransitioning} 
                showExperience={showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe}
                shouldShowSquare={shouldShowSquare && showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe}
                isReversing={isReversing}
              />
            </div>
          </div>

          {/* Projects Section */}
          <div
            id="projects-section"
            className={`w-full min-h-0 lg:min-h-full ${
              isMobile 
                ? "relative" 
                : "absolute inset-0 lg:inset-0"
            }`}
            style={isMobile ? {} : {
              opacity: showProjects && !showTestimonials && !showEducation && !showAboutMe ? 1 : 0,
              transition: "opacity 1000ms ease-in-out",
              pointerEvents: showProjects && !showTestimonials && !showEducation && !showAboutMe ? "auto" : "none",
            }}
          >
            <Projects 
              isTransitioning={isTransitioning} 
              showProjects={isMobile ? true : (showProjects && !showTestimonials && !showEducation && !showAboutMe)}
              shouldShowSquare={shouldShowSquare && showProjects && !showTestimonials && !showEducation && !showAboutMe}
              isReversing={isReversing}
            />
          </div>

          {/* Education Section */}
          <div
            id="education-section"
            className={`w-full min-h-0 lg:min-h-full ${
              isMobile 
                ? "relative" 
                : "absolute inset-0 lg:inset-0"
            }`}
            style={isMobile ? {} : {
              opacity: showEducation && !showAboutMe ? 1 : 0,
              transition: "opacity 1000ms ease-in-out",
              pointerEvents: showEducation && !showAboutMe ? "auto" : "none",
            }}
          >
            {/* Mobile/Tablet Education - shown on screens < 1024px */}
            <div className="lg:hidden">
              <MobileEducation isTransitioning={isTransitioning} showEducation={true} />
            </div>
            {/* Desktop Education - shown on screens >= 1024px */}
            <div className="hidden lg:block">
              <Education 
                isTransitioning={isTransitioning} 
                showEducation={showEducation && !showAboutMe}
                shouldShowSquare={shouldShowSquare && showEducation && !showAboutMe}
                isReversing={isReversing}
              />
            </div>
          </div>

          {/* Testimonials Section */}
          <div
            id="testimonials-section"
            className={`w-full min-h-0 lg:min-h-full ${
              isMobile 
                ? "relative" 
                : "absolute inset-0 lg:inset-0"
            }`}
            style={isMobile ? {} : {
              opacity: showTestimonials && !showEducation && !showAboutMe ? 1 : 0,
              transition: "opacity 1000ms ease-in-out",
              pointerEvents: showTestimonials && !showEducation && !showAboutMe ? "auto" : "none",
            }}
          >
            {/* Mobile/Tablet Testimonials - shown on screens < 1024px */}
            <div className="lg:hidden">
              <MobileTestimonials isTransitioning={isTransitioning} showTestimonials={true} />
            </div>
            {/* Desktop Testimonials - shown on screens >= 1024px */}
            <div className="hidden lg:block">
              <Testimonials 
                isTransitioning={isTransitioning} 
                showTestimonials={showTestimonials && !showEducation && !showAboutMe}
                shouldShowSquare={shouldShowSquare && showTestimonials && !showEducation && !showAboutMe}
                isReversing={isReversing}
              />
            </div>
          </div>

          {/* About Me Section */}
          <div
            id="about-me-section"
            className={`w-full min-h-0 lg:min-h-full ${
              isMobile 
                ? "relative" 
                : "absolute inset-0 lg:inset-0"
            }`}
            style={isMobile ? {} : {
              opacity: showAboutMe ? 1 : 0,
              transition: "opacity 1000ms ease-in-out",
              pointerEvents: showAboutMe ? "auto" : "none",
            }}
          >
            <div className="lg:hidden">
              <MobileAboutMe isTransitioning={isTransitioning} showAboutMe={true} />
            </div>
            <div className="hidden lg:block">
              <AboutMe 
                isTransitioning={isTransitioning} 
                showAboutMe={showAboutMe}
                shouldShowSquare={shouldShowSquare && showAboutMe}
                isReversing={isReversing}
              />
            </div>
          </div>

          </div>
          {/* Contact Section - footer, no planet */}
          <Contact />

          {/* FocusedPlanets - rendered at top level for correct positioning relative to containerRef */}
          {!isMobile &&
            planetStartPosition &&
            planetEndPosition &&
            FOCUSED_PLANET_CONFIG.map(({ planet, isShown }) => {
              const shown = isShown(showExperience, showProjects, showTestimonials, showEducation, showAboutMe);
              return activePlanetIndex === planet.index && shown ? (
                <React.Fragment key={planet.index}>
                  <FocusedPlanet
                    originalPlanet={planet}
                    startPosition={planetStartPosition}
                    endPosition={planetEndPosition}
                    endSize={planetEndSize}
                    reverse={isPlanetReturning}
                    animationDuration={isPlanetReturning ? 300 : 1000}
                    paused={
                      (shown && !isTransitioning && !isReversing) ||
                      (isReversing && isPlanetReturning && activePlanetIndex !== planet.index)
                    }
                  />
                  {originalPlanetPosition && (
                    <PlanetProjection
                      originalPlanetPosition={originalPlanetPosition}
                      originalPlanetSize={planet.size}
                      focusedPlanetPosition={planetEndPosition}
                      focusedPlanetSize={planetEndSize}
                    />
                  )}
                </React.Fragment>
              ) : null;
            })}

        </div>
        </main>
      </div>
    </div>
  );
};

type ShowSectionFlags = (
  showExperience: boolean,
  showProjects: boolean,
  showTestimonials: boolean,
  showEducation: boolean,
  showAboutMe: boolean
) => boolean;

const FOCUSED_PLANET_CONFIG: { planet: (typeof planets)[number]; isShown: ShowSectionFlags }[] = [
  { planet: planets[0], isShown: (se, sp, st, ed, am) => se && !sp && !st && !ed && !am },
  { planet: planets[1], isShown: (se, sp, st, ed, am) => sp && !se && !st && !ed && !am },
  { planet: planets[2], isShown: (se, sp, st, ed, am) => ed && !se && !sp && !st && !am },
  { planet: planets[3], isShown: (se, sp, st, ed, am) => st && !se && !sp && !ed && !am },
  { planet: planets[4], isShown: (se, sp, st, ed, am) => am && !se && !sp && !st && !ed },
];

export default Index;
