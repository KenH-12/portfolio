import { PlanetVisual } from "./PlanetVisual";
import { Rings } from "./Rings";
import { Moon } from "./Moon";
import {
  generateOrbitalKeyframes,
  generateSimpleOrbitTransform,
  getSimpleOrbitInitialTransform,
  getOrbitalAngle,
  calcZDepth,
  calcZIndex,
  type OrbitalConfig,
  type ZDepthConfig,
} from "@/lib/orbital-animation";
import type { MoonData } from "@/types/planet";

interface PlanetProps {
  size: number;
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  glowColor: string;
  orbitRadius: number;
  orbitDuration: number;
  initialAngle: number;
  animationName: string;
  offsetY?: number;
  tiltAngle?: number; // Angle to tilt the orbital plane (degrees)
  hasTexture?: boolean; // Whether to add texture overlay
  textureName?: string; // Name of the texture to use (e.g., 'experience', 'projects', 'testimonials', 'education')
  textureRotationSpeed?: number; // Duration in seconds for one full texture rotation
  textureRotationAngle?: number; // Initial texture rotation in degrees (e.g. match ringTiltAngle)
  hasRings?: boolean; // Whether to add rings around the planet
  ringTiltAngle?: number; // Angle to tilt the rings around Z-axis (degrees, perpendicular to viewport)
  ringRadius?: number; // Radius of the rings (defaults to size * 2.5)
  isPulsating?: boolean; // Whether the planet should have a pulsating glow effect
  onHover?: (isHovering: boolean) => void; // Callback for hover events
  moons?: MoonData[];
}

export function Planet({
  size,
  gradientColors,
  glowColor,
  orbitRadius,
  orbitDuration,
  initialAngle,
  animationName,
  offsetY = 0,
  tiltAngle = 0,
  hasTexture = false,
  textureName,
  textureRotationSpeed,
  textureRotationAngle,
  hasRings = false,
  ringTiltAngle = 0,
  ringRadius,
  isPulsating = false,
  onHover,
  moons,
}: PlanetProps) {
  // Calculate Z depth scale based on orbit radius
  const depthScale = orbitRadius * 0.4;
  
  // Create orbital and Z depth configs
  const orbitalConfig: OrbitalConfig = {
    orbitRadius,
    orbitDuration,
    initialAngle,
    offsetY,
    tiltAngle,
  };
  
  const zDepthConfig: ZDepthConfig = {
    depthScale,
  };
  
  // Generate keyframes using the utility function
  const animationKeyframes = generateOrbitalKeyframes(
    animationName,
    20, // 21 keyframes (0% to 100% in 5% increments)
    (progress) => {
      const transform = generateSimpleOrbitTransform(progress, orbitalConfig, zDepthConfig);
      const angle = getOrbitalAngle(progress, initialAngle);
      const zDepth = calcZDepth(angle, depthScale);
      const zIndex = calcZIndex(zDepth);
      return { transform, zIndex };
    }
  );

  // Calculate initial transform to match 0% keyframe
  const initialTransform = getSimpleOrbitInitialTransform(orbitalConfig, zDepthConfig);
  // Calculate initial z-index to match 0% keyframe
  const angleAtStart = getOrbitalAngle(0, initialAngle);
  const initialZDepth = calcZDepth(angleAtStart, depthScale);
  const initialZIndex = calcZIndex(initialZDepth);

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2"
        data-hero-planet
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: `${animationName} ${orbitDuration}s linear infinite`,
          transform: initialTransform, // Set initial transform to match 0% keyframe
          zIndex: initialZIndex, // Set initial z-index to match 0% keyframe
          transformOrigin: "0 0",
          transformStyle: "preserve-3d",
          willChange: "transform",
          pointerEvents: onHover ? "auto" : "none",
        }}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 500 }}>
          <PlanetVisual
            size={size}
            gradientColors={gradientColors}
            glowColor={glowColor}
            hasTexture={hasTexture}
            textureName={textureName}
            textureRotationSpeed={textureRotationSpeed}
            textureRotationAngle={textureRotationAngle}
            isPulsating={isPulsating}
          />
          {hasRings && (
            <Rings
              gradientColors={gradientColors}
              ringRadius={ringRadius}
              ringTiltAngle={ringTiltAngle}
              size={size}
            />
          )}
        </div>
        {moons?.length ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}
          >
            {moons.map((moon, i) => (
              <Moon
                key={i}
                size={moon.size}
                orbitRadius={moon.orbitRadius}
                orbitDuration={moon.orbitDuration}
                initialAngle={moon.initialAngle}
                tiltAngle={moon.tiltAngle}
                animationName={`orbit-moon-${animationName}-${i}`}
                gradientColors={moon.gradientColors}
                glowColor={moon.glowColor}
              />
            ))}
          </div>
        ) : null}
      </div>
      <style>{animationKeyframes}</style>
    </>
  );
}
