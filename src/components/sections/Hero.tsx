import React, { useEffect, useRef, useState } from "react";
import { Code, MapPin, Palette } from "lucide-react";
import { Planet } from "../celestial/Planet";
import { Star } from "../celestial/Star";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeroBadge } from "./HeroBadge";
import type { PlanetData } from "@/types/planet";
import { CONTENT_FADE_DELAY_MS, HERO_INTRO_DURATIONS } from "@/lib/heroIntro";

const planets: PlanetData[] = [
  {
    label: "Experience",
    index: 0,
    size: 38,
    gradientColors: {
      from: "rgb(251, 146, 60)",
      via: "rgb(239, 68, 68)",
      to: "rgb(225, 29, 72)",
    },
    glowColor: "rgba(251,146,60,0.4)",
    hasTexture: true,
    textureName: "experience",
    textureRotationSpeed: 12, // Slower rotation for larger planet
    orbitRadius: 290,
    orbitDuration: 44,
    initialAngle: 330,
    animationName: "orbit-planet2",
    offsetY: -16,
    tiltAngle: 80,
    moons: [
      { size: 5, orbitRadius: 50, orbitDuration: 11, initialAngle: 0, tiltAngle: 60 },
      { size: 7, orbitRadius: 63, orbitDuration: 15, initialAngle: 120, tiltAngle: 60 },
      { size: 3, orbitRadius: 35, orbitDuration: 7, initialAngle: 240, tiltAngle: 60 },
      { size: 2, orbitRadius: 26, orbitDuration: 5, initialAngle: 300, tiltAngle: 60 },
    ],
  },
  {
    label: "Projects",
    index: 1,
    size: 23,
    gradientColors: {
      from: "rgb(34, 211, 238)",
      via: "rgb(59, 130, 246)",
      to: "rgb(20, 184, 166)",
    },
    glowColor: "rgba(34,211,238,0.4)",
    hasTexture: true,
    textureName: "projects",
    textureRotationSpeed: 3,
    orbitRadius: 110,
    orbitDuration: 18,
    initialAngle: 210,
    animationName: "orbit-planet1",
    offsetY: -12,
    tiltAngle: 62,
    moons: [
      { size: 3, orbitRadius: 22, orbitDuration: 5, initialAngle: 80, tiltAngle: 60 },
    ],
  },
  {
    label: "Education",
    index: 2,
    size: 32,
    gradientColors: {
      from: "rgb(34, 197, 94)",
      via: "rgb(16, 185, 129)",
      to: "rgb(5, 150, 105)",
    },
    glowColor: "rgba(34,197,94,0.4)",
    hasTexture: true,
    textureName: "education",
    textureRotationSpeed: 15,
    orbitRadius: 190,
    orbitDuration: 26,
    initialAngle: 60,
    animationName: "orbit-planet4",
    offsetY: -14,
    tiltAngle: 60,
    moons: [
      { size: 3, orbitRadius: 40, orbitDuration: 14, initialAngle: 0, tiltAngle: 60 },
      { size: 5, orbitRadius: 29, orbitDuration: 11, initialAngle: 180, tiltAngle: 60 },
    ],
  },
  {
    label: "Testimonials",
    index: 3,
    size: 24,
    gradientColors: {
      from: "rgb(192, 132, 252)",
      via: "rgb(236, 72, 153)",
      to: "rgb(192, 38, 211)",
    },
    glowColor: "rgba(192,132,252,0.4)",
    hasTexture: true,
    textureName: "testimonials",
    textureRotationSpeed: 13,
    orbitRadius: 380,
    orbitDuration: 60,
    initialAngle: 90,
    animationName: "orbit-planet3",
    offsetY: -10,
    tiltAngle: 54,
    hasRings: true,
    ringTiltAngle: -60,
    ringRadius: 80,
    textureRotationAngle: -24,
  },
  {
    label: "About Me",
    index: 4,
    size: 38,
    gradientColors: {
      from: "rgb(15, 23, 42)",
      via: "rgb(30, 58, 138)",
      to: "rgb(59, 130, 246)",
    },
    glowColor: "rgba(59,130,246,0.4)",
    hasTexture: true,
    textureName: "aboutme",
    textureRotationSpeed: 18,
    orbitRadius: 410,
    orbitDuration: 60,
    initialAngle: 230,
    animationName: "orbit-planet5",
    offsetY: -14,
    tiltAngle: 49,
  },
];

export { planets };

interface SolarSystemInnerProps {
  solarSystemScale: number;
  isLargeDesktop: boolean;
  planets: PlanetData[];
  hoveredPlanetIndex: number | null;
}

const SolarSystemInner = React.memo(function SolarSystemInner({
  solarSystemScale,
  isLargeDesktop,
  planets,
  hoveredPlanetIndex,
}: SolarSystemInnerProps) {
  return (
    <div
      className="relative hero-solar-inner"
      style={{
        width: isLargeDesktop ? "520px" : "400px",
        height: isLargeDesktop ? "520px" : "400px",
        transformOrigin: "center center",
        ["--solar-final-scale" as string]: solarSystemScale,
        transform: "scale(0) translateZ(0)",
        animation: `hero-solar-scale-in ${HERO_INTRO_DURATIONS.LIGHTSPEED_MS}ms ease-out ${HERO_INTRO_DURATIONS.SOLAR_SCALE_DELAY_MS}ms forwards`,
        willChange: "transform",
      }}
    >
      <Star />
      {planets.map((planet, index) => (
        <div
          key={planet.animationName}
          data-planet-index={index}
          style={{ opacity: 1, pointerEvents: "none" }}
        >
          <Planet
            size={planet.size}
            gradientColors={planet.gradientColors}
            glowColor={planet.glowColor}
            orbitRadius={planet.orbitRadius}
            orbitDuration={planet.orbitDuration}
            initialAngle={planet.initialAngle}
            animationName={planet.animationName}
            offsetY={planet.offsetY}
            tiltAngle={planet.tiltAngle}
            hasTexture={planet.hasTexture}
            textureName={planet.textureName}
            textureRotationSpeed={planet.textureRotationSpeed}
            textureRotationAngle={planet.textureRotationAngle}
            hasRings={planet.hasRings}
            ringTiltAngle={planet.ringTiltAngle}
            ringRadius={planet.ringRadius}
            isPulsating={hoveredPlanetIndex === index}
            moons={planet.moons}
          />
        </div>
      ))}
    </div>
  );
});

interface HeroProps {
  introActive?: boolean;
  isTransitioning?: boolean;
  showExperience?: boolean;
  showProjects?: boolean;
  showTestimonials?: boolean;
  showEducation?: boolean;
  showAboutMe?: boolean;
  showContact?: boolean;
  isReversing?: boolean;
  isPlanetReturning?: boolean;
  showOriginalPlanet?: boolean;
  shouldMoveSolarSystemBack?: boolean;
  activePlanetIndex?: number | null;
  planetStartPosition?: { x: number; y: number } | null;
  onPlanetHover?: (index: number | null) => void;
  hoveredPlanetIndex?: number | null;
}

const MOBILE_BREAKPOINT = 1024;

function getSolarScaleFromViewport(): number {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth < MOBILE_BREAKPOINT) return 0.5;
  if (window.matchMedia("(min-width: 1920px)").matches) return 1.5;
  return 1;
}

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function Hero({ introActive = false, isTransitioning = false, showExperience = false, showProjects = false, showTestimonials = false, showEducation = false, showAboutMe = false, showContact = false, isReversing = false, isPlanetReturning = false, showOriginalPlanet = false, shouldMoveSolarSystemBack = false, activePlanetIndex = null, planetStartPosition = null, onPlanetHover, hoveredPlanetIndex = null }: HeroProps) {
  const planetContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLargeDesktop, setIsLargeDesktop] = useState(
    () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 1920px)").matches : false)
  );
  // Match useIsMobile breakpoint so first paint uses correct scale/container on mobile (hook returns false until effect runs)
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [solarSystemScale, setSolarSystemScale] = useState(getSolarScaleFromViewport);
  // On mobile, always show Hero content (sections stack below); on desktop hide when a section is focused or Contact overlay is shown
  const hideHeroContent = !isMobile && (isTransitioning || showExperience || showProjects || showTestimonials || showEducation || showAboutMe || showContact);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1920px)");
    const onChange = () => setIsLargeDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    setIsLargeDesktop(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setIsMobileViewport(isMobile);
    setSolarSystemScale(isMobile ? 0.5 : isLargeDesktop ? 1.5 : 1);
  }, [isMobile, isLargeDesktop]);

  // Determine if solar system should be up (desktop only)
  const shouldBeUp = !isMobile && (
    (isTransitioning && !isReversing) || 
    (showExperience && !isReversing) || 
    (showProjects && !isReversing) || 
    (showTestimonials && !isReversing) || 
    (showEducation && !isReversing) || 
    (showAboutMe && !isReversing) || 
    (showContact && !isReversing) ||
    (isReversing && !shouldMoveSolarSystemBack)
  );

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Effects - CSS intro fade when introActive, else section opacity */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174,72%,56%,0.08)_0%,transparent_50%)]"
        style={{
          ...(introActive
            ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
            : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
        }}
      />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
        style={{
          ...(introActive
            ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
            : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl animate-float" 
        style={{ 
          animationDelay: "2s",
          ...(introActive
            ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
            : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
        }} 
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(hsl(222,30%,15%,0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(222,30%,15%,0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        style={{
          ...(introActive
            ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
            : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">

        {/* Heading */}
        <h1 
          className={`font-hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mt-32 sm:mt-20 lg:mt-24 hero-heading-responsive ${
            isMobile ? "mb-4" : "mb-8"
          }`} 
          style={{ 
            ...(introActive
              ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
              : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
          }}
        >
          <span className="gradient-text">Ken Henderson</span>{" "}
        </h1>

        {/* Badges */}
        <HeroBadge
          icon={Code}
          text="Full Stack Engineer"
          opacity={!introActive && hideHeroContent ? 0 : 1}
          transition="opacity 1000ms ease-in-out"
          style={introActive ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` } : undefined}
        />
        <HeroBadge
          icon={Palette}
          text="Creative Coder"
          opacity={!introActive && hideHeroContent ? 0 : 1}
          transition="opacity 1000ms ease-in-out"
          style={introActive ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` } : undefined}
        />
        <HeroBadge
          icon={MapPin}
          text="Victoria BC"
          opacity={!introActive && hideHeroContent ? 0 : 1}
          transition="opacity 1000ms ease-in-out"
          style={introActive ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` } : undefined}
        />

        {/* Subheading */}
        <div 
          className={`font-subheading text-muted-foreground mx-auto mb-0 ${
            isMobile ? 'text-sm max-w-[calc(100vw-3rem)] px-2' : 'text-lg sm:text-xl max-w-2xl'
          }`}
          style={{ 
            ...(introActive
              ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards` }
              : { opacity: hideHeroContent ? 0 : 1, transition: "opacity 1000ms ease-in-out" }),
          }}
        >
          <p className="mb-0">
            Searching the galaxy for a proven, experienced, driven, highly competent dev with a passion for what they do?
          </p>
          <div className="relative flex flex-col items-center justify-center mt-4">
            <span className={`gradient-text-yellow font-semibold mb-0 ${
              isMobile ? 'text-lg' : 'text-xl sm:text-2xl'
            }`}>Look no further.</span>
          </div>
        </div>

        {/* Star and planets - behind content, below subheading - single-unit scale for load intro */}
        <div 
            ref={planetContainerRef}
            className="relative mx-auto z-0 flex items-center justify-center -mt-12 overflow-visible solar-system-responsive" 
            style={{ 
              width: isMobileViewport ? "75vw" : (isLargeDesktop ? "520px" : "400px"),
              height: isMobileViewport ? "75vw" : (isLargeDesktop ? "520px" : "400px"),
              minWidth: isMobileViewport ? "0" : (isLargeDesktop ? "520px" : "400px"),
              minHeight: isMobileViewport ? "0" : (isLargeDesktop ? "520px" : "400px"),
              maxWidth: isMobileViewport ? "75vw" : (isLargeDesktop ? "520px" : "400px"),
              maxHeight: isMobileViewport ? "75vw" : (isLargeDesktop ? "520px" : "400px"),
              perspective: "1200px", // Enable 3D perspective
              transformStyle: "preserve-3d",
              willChange: hideHeroContent ? "transform" : "auto",
              opacity: 1,
              transform: isMobile 
                ? "translateY(0)" // Always visible on mobile - will animate down when switching from desktop
                : (shouldBeUp 
                    ? (isLargeDesktop ? "translateY(-586px)" : "translateY(calc(80px - 50vh + (100vh - 100vw) * 0.15))") 
                    : "translateY(0)"),
              transition: "transform 1000ms ease-in-out",
            }}
          >
            <SolarSystemInner
              solarSystemScale={solarSystemScale}
              isLargeDesktop={isLargeDesktop}
              planets={planets}
              hoveredPlanetIndex={hoveredPlanetIndex ?? null}
            />
          </div>

      </div>

      {/* Responsive spacing, intro solar scale and content fade */}
      <style>{`
        @keyframes hero-solar-scale-in {
          0% {
            transform: scale(0) translateZ(0);
          }
          100% {
            transform: scale(var(--solar-final-scale, 1)) translateZ(0);
          }
        }
        @keyframes hero-intro-content-fade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @media (min-width: 650px) and (max-width: 767px) {
          .hero-heading-responsive {
            margin-top: 40vw;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-heading-responsive {
            margin-top: 50vw;
          }

          .solar-system-responsive {
            margin-top: -10rem;
          }
        }
      `}</style>

    </section>
  );
}
