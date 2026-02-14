/**
 * Moon orbit data: orbits the parent planet in its local space.
 */
export interface MoonData {
  size: number;
  orbitRadius: number;
  orbitDuration: number;
  initialAngle: number;
  tiltAngle?: number;
  gradientColors?: {
    from: string;
    via: string;
    to: string;
  };
  glowColor?: string;
}

/**
 * Single source of truth for planet data used across Hero, FocusedPlanet, sections, and layout.
 * index identifies the planet in the Hero order (0–4) and is used to avoid hardcoded indices.
 */
export interface PlanetData {
  index: number;
  size: number;
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  glowColor: string;
  hasTexture?: boolean;
  textureName?: string;
  textureRotationSpeed?: number;
  textureRotationAngle?: number;
  hasRings?: boolean;
  ringTiltAngle?: number;
  ringRadius?: number;
  animationName?: string;
  // Hero/orbit – optional when only visual data is needed (e.g. FocusedPlanet)
  label?: string;
  orbitRadius?: number;
  orbitDuration?: number;
  initialAngle?: number;
  offsetY?: number;
  tiltAngle?: number;
  moons?: MoonData[];
}
