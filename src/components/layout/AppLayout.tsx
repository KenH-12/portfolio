import { PlanetLegend } from "../sections/PlanetLegend";
import { Linkedin, Github, MailIcon, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileSidebar } from "./MobileSidebar";
import { ContactLink } from "./ContactLink";
import type { PlanetData } from "@/types/planet";
import { CONTENT_FADE_DELAY_MS, HERO_INTRO_DURATIONS } from "@/lib/heroIntro";

interface AppLayoutProps {
  planets: PlanetData[];
  hoveredPlanetIndex: number | null;
  onPlanetHover: (index: number | null) => void;
  onPlanetClick: (planetLabel: string) => void;
  onHeroClick?: () => void;
  introActive?: boolean;
  isTransitioning?: boolean;
  isReversing?: boolean;
  showExperience?: boolean;
  showProjects?: boolean;
  showTestimonials?: boolean;
  showEducation?: boolean;
  showAboutMe?: boolean;
  showContact?: boolean;
  contactExiting?: boolean;
}

export function AppLayout({
  planets,
  hoveredPlanetIndex,
  onPlanetHover,
  onPlanetClick,
  onHeroClick,
  introActive = false,
  isTransitioning = false,
  showExperience = false,
  showProjects = false,
  showTestimonials = false,
  showEducation = false,
  showAboutMe = false,
  showContact = false,
  contactExiting = false,
}: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  // Determine if we're on Hero section (no sections shown, and Contact overlay not shown)
  const isOnHero = !showExperience && !showProjects && !showTestimonials && !showEducation && !showAboutMe && !showContact && !contactExiting;
  const useIntroFade = isOnHero && introActive;

  return (
    <div className="w-full min-[1920px]:max-w-full min-[1920px]:absolute min-[1920px]:inset-0">
      {/* Hero anchor - top-left, fades in/out based on Hero state, hidden on mobile */}
      <a
        href="#"
        data-hoverable
        onClick={(e) => {
          e.preventDefault();
          onHeroClick?.();
        }}
        className={`group fixed min-[1920px]:absolute top-2 left-2 z-30 font-hero-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight ${
          isMobile ? 'hidden' : ''
        }`}
        style={{
          textDecoration: 'none',
          opacity: isMobile ? 0 : (isOnHero ? 0 : 1),
          transition: 'opacity 1000ms ease-in-out',
          pointerEvents: isMobile || isOnHero || showContact || contactExiting ? 'none' : 'auto',
        }}
      >
        <span className="gradient-text-yellow flex items-center gap-1">
          Ken Henderson
          <span
            className="hero-anchor-chevron inline-block transition-opacity duration-300"
            style={{ opacity: showContact || contactExiting ? 0 : 1 }}
          >
            <ChevronUp className="w-10 h-10 text-primary" />
          </span>
        </span>
      </a>
      <style>{`
        @keyframes hero-chevron-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .group:hover .hero-anchor-chevron {
          animation: hero-chevron-bounce 2s ease-in-out infinite;
        }
      `}</style>

      {/* Contact links - hidden when Contact section is shown; CSS intro fade when on Hero and intro active */}
      <div
        className={`fixed min-[1920px]:absolute z-30 flex flex-col gap-2 text-sm sm:text-base ${
          isMobile
            ? 'top-4 right-4' // Top-right on mobile/tablet
            : isOnHero 
              ? 'top-4 left-2' 
              : 'top-16 left-2'
        }`}
        style={{
          transition: "opacity 300ms ease-out, top 1000ms ease-in-out, left 1000ms ease-in-out, right 1000ms ease-in-out",
          ...(isMobile ? {} : showContact || contactExiting
            ? { opacity: 0, pointerEvents: "none" as const }
            : useIntroFade
              ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards`, pointerEvents: "none" as const }
              : { opacity: 1 }),
        }}
      >
        <div className="flex flex-row gap-3">
          <ContactLink
            href="mailto:kenhenderson12@hotmail.com"
            icon={MailIcon}
          />
          <ContactLink
            href="https://linkedin.com/in/ken-henderson-7828161b5"
            icon={Linkedin}
            target="_blank"
            rel="noopener noreferrer"
          />
          <ContactLink
            href="https://github.com/KenH-12"
            icon={Github}
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>

      {/* Planet Legend - hidden on mobile/tablet; CSS intro fade when on Hero */}
      <div
        className={`fixed min-[1920px]:absolute left-0 top-1/2 -translate-y-1/2 z-20 ${isMobile ? 'hidden' : ''}`}
        style={
          useIntroFade
            ? { opacity: 0, animation: `hero-intro-content-fade ${HERO_INTRO_DURATIONS.CONTENT_MS}ms ease-out ${CONTENT_FADE_DELAY_MS}ms forwards`, pointerEvents: "none" as const }
            : { opacity: 1 }
        }
      >
        <PlanetLegend 
          planets={planets} 
          hoveredPlanetIndex={hoveredPlanetIndex}
          onPlanetHover={onPlanetHover}
          onPlanetClick={onPlanetClick}
          isTransitioning={isTransitioning}
          showExperience={showExperience}
          showProjects={showProjects}
          showTestimonials={showTestimonials}
          showEducation={showEducation}
          showAboutMe={showAboutMe}
          showContact={showContact}
          contactExiting={contactExiting}
          isOnHero={isOnHero}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        planets={planets}
        hoveredPlanetIndex={hoveredPlanetIndex}
        onPlanetHover={onPlanetHover}
        onPlanetClick={onPlanetClick}
        onHeroClick={onHeroClick}
        isTransitioning={isTransitioning}
        showExperience={showExperience}
        showProjects={showProjects}
        showTestimonials={showTestimonials}
        showEducation={showEducation}
        showAboutMe={showAboutMe}
      />
    </div>
  );
}
