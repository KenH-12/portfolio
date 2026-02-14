import { useMemo } from "react";
import { ShootingStar } from "./ShootingStar";
import { useIsMobile } from "@/hooks/use-mobile";

const CONTACT_TRANSITION_MS = 900;

interface StarrySkyProps {
  introActive: boolean;
  lightspeedDurationMs: number;
  /** When true (desktop Contact transition), vertically elongate for "descending through space" effect */
  elongateForContact?: boolean;
  /** When true at min-width 1920px, stars fade out (Contact forward); when false, stars fade in (reverse) */
  showContact?: boolean;
  /** When true, Contact overlay is exiting so stars should fade back in */
  contactExiting?: boolean;
}

export function StarrySky({
  introActive,
  lightspeedDurationMs,
  elongateForContact = false,
  showContact = false,
  contactExiting = false,
}: StarrySkyProps) {
  const isMobile = useIsMobile();
  const starsFadedForContact = showContact && !contactExiting;

  // Generate random star positions and sizes - memoized to generate only once
  const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
  };

  const stars = useMemo(() => generateStars(150), []);
  const brightStars = useMemo(() => generateStars(30), []);

  // Generate random shooting stars - memoized to generate only once
  const generateShootingStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      // Random start position (can be off-screen)
      const startX = Math.random() * 120 - 10; // -10% to 110%
      const startY = Math.random() * 120 - 10;
      
      // Random angle for direction of travel (0-360 degrees)
      const angle = Math.random() * 360;
      
      // Random travel distance (400-800px)
      const distance = Math.random() * 400 + 400;
      
      // Calculate end position based on angle and distance
      const radians = (angle * Math.PI) / 180;
      const moveX = Math.cos(radians) * distance;
      const moveY = Math.sin(radians) * distance;
      
      // Random properties
      const length = Math.random() * 80 + 100; // 100-180px
      const height = Math.random() * 4 + 4; // 4-8px
      const duration = Math.random() * 0.85 + 0.4; // 0.4-1.25s
      const delay = Math.random() * 20; // 0-20s delay (randomized interval)
      const intensity = Math.random() * 0.3 + 0.7; // 0.7-1.0
      
      return {
        id: i,
        startX,
        startY,
        angle,
        moveX,
        moveY,
        length,
        height,
        duration,
        delay,
        intensity,
        animationName: `shooting-star-${i}`,
      };
    });
  };

  const shootingStars = useMemo(() => generateShootingStars(1), []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        transition: `transform ${elongateForContact ? CONTACT_TRANSITION_MS * 1.2 : CONTACT_TRANSITION_MS * 0.9}ms ease-out`,
        transformOrigin: "50% 100%",
        transform: elongateForContact ? "scaleY(4)" : "scaleY(1)",
      }}
    >
      {/* Base dark blue gradient sky */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at top, hsl(222, 60%, 8%) 0%, hsl(222, 70%, 4%) 50%, hsl(222, 80%, 2%) 100%)`,
        }}
      />
      
      {/* Star layer: radial scale from centre for light-speed; fades at 1920px for Contact; no stars within 1rem of bottom */}
      <div
        className="starry-sky-stars-layer absolute inset-0"
        data-faded={starsFadedForContact}
        style={{
          transition: `opacity ${CONTACT_TRANSITION_MS}ms ease-out`,
          clipPath: isMobile ? "inset(0 0 1rem 0)" : "none",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: "50% 50%",
            animation: introActive
              ? `lightspeed-streak ${lightspeedDurationMs}ms ease-out forwards`
              : "none",
            transform: introActive ? undefined : "scale(1)",
          }}
        >
        {/* Small stars - twinkle delayed until after lightspeed when intro active */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: introActive ? `${lightspeedDurationMs}ms` : `${star.delay}s`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Bright stars */}
        {brightStars.map((star) => (
          <div
            key={`bright-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 1.5}px`,
              height: `${star.size * 1.5}px`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 1), 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.5)`,
              animation: `twinkle-bright ${star.duration * 1.5}s ease-in-out infinite`,
              animationDelay: introActive ? `${lightspeedDurationMs}ms` : `${star.delay}s`,
              opacity: 0.9,
            }}
          />
        ))}
        </div>

        {/* Shooting stars occasionally - randomized */}
        {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          startX={star.startX}
          startY={star.startY}
          angle={star.angle}
          moveX={star.moveX}
          moveY={star.moveY}
          length={star.length}
          height={star.height}
          duration={star.duration}
          delay={star.delay}
          intensity={star.intensity}
          animationName={star.animationName}
        />
        ))}
      </div>

      <style>{`
        @media (min-width: 1920px) {
          .starry-sky-stars-layer[data-faded="true"] {
            opacity: 0;
          }
        }
        .starry-sky-stars-layer {
          opacity: 1;
        }
        @keyframes lightspeed-streak {
          0% {
            transform: scale(0.01);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes twinkle-bright {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
