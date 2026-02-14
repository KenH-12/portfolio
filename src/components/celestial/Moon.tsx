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

const DEFAULT_GRADIENT = {
  from: "rgb(200, 200, 220)",
  via: "rgb(180, 180, 200)",
  to: "rgb(160, 160, 180)",
};
const DEFAULT_GLOW = "rgba(200, 200, 220, 0.3)";

interface MoonProps {
  size: number;
  orbitRadius: number;
  orbitDuration: number;
  initialAngle: number;
  tiltAngle?: number;
  animationName: string;
  gradientColors?: {
    from: string;
    via: string;
    to: string;
  };
  glowColor?: string;
}

export function Moon({
  size,
  orbitRadius,
  orbitDuration,
  initialAngle,
  tiltAngle = 0,
  animationName,
  gradientColors = DEFAULT_GRADIENT,
  glowColor = DEFAULT_GLOW,
}: MoonProps) {
  const depthScale = orbitRadius * 0.4;

  const orbitalConfig: OrbitalConfig = {
    orbitRadius,
    orbitDuration,
    initialAngle,
    tiltAngle,
  };

  const zDepthConfig: ZDepthConfig = {
    depthScale,
  };

  const animationKeyframes = generateOrbitalKeyframes(
    animationName,
    20,
    (progress) => {
      const transform = generateSimpleOrbitTransform(
        progress,
        orbitalConfig,
        zDepthConfig
      );
      const angle = getOrbitalAngle(progress, initialAngle);
      const zDepth = calcZDepth(angle, depthScale);
      const zIndex = calcZIndex(zDepth, -depthScale, depthScale);
      return { transform, zIndex };
    }
  );

  const initialTransform = getSimpleOrbitInitialTransform(
    orbitalConfig,
    zDepthConfig
  );
  const angleAtStart = getOrbitalAngle(0, initialAngle);
  const initialZDepth = calcZDepth(angleAtStart, depthScale);
  const initialZIndex = calcZIndex(initialZDepth, -depthScale, depthScale);

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: `${animationName} ${orbitDuration}s linear infinite`,
          transform: initialTransform,
          zIndex: initialZIndex,
          transformOrigin: "0 0",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <div
          className="rounded-full shadow-lg"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `linear-gradient(to bottom right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`,
            boxShadow: `0 0 ${size * 0.6}px ${size * 0.2}px ${glowColor}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
          }}
        />
      </div>
      <style>{animationKeyframes}</style>
    </>
  );
}
