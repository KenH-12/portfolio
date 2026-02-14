/**
 * Utility functions for generating orbital animations
 * Used by Planet component
 */

export interface OrbitalConfig {
  orbitRadius: number;
  orbitDuration: number;
  initialAngle: number;
  offsetY?: number;
  tiltAngle?: number;
}

export interface ZDepthConfig {
  depthScale: number;
}

/**
 * Calculate the orbital angle at a given progress (0-1)
 * For simple orbits: angle = initialAngle + (progress * 360)
 * For multiple orbits: angle = initialAngle + (progress * orbitsPerCycle * 360)
 */
export function getOrbitalAngle(
  progress: number,
  initialAngle: number,
  orbitsPerCycle: number = 1
): number {
  return initialAngle + (progress * orbitsPerCycle * 360);
}

/**
 * Calculate Z depth based on orbital angle to create 3D depth effect
 * Z depth varies with sin(angle) - when at top (0°) object is closest, at bottom (180°) farthest
 */
export function calcZDepth(angle: number, depthScale: number): number {
  const radians = (angle * Math.PI) / 180;
  const z = Math.sin(radians) * depthScale;
  // Round to avoid precision issues
  return Math.round(z * 100) / 100;
}

/**
 * Calculate scale based on Z depth - larger when closer, smaller when farther
 */
export function calcScale(zDepth: number, minZDepth: number, maxZDepth: number): number {
  // Map Z depth from [minZDepth, maxZDepth] to scale [0.7, 1.3]
  const normalizedZ = (zDepth - minZDepth) / (maxZDepth - minZDepth); // 0 to 1
  const scale = 0.7 + (normalizedZ * 0.6); // 0.7 to 1.3
  return Math.round(scale * 100) / 100;
}

/**
 * Global Z depth range for all celestial bodies
 * Based on maximum orbit radius of 320px * 0.4 depth scale = 128px
 * Adding buffer for safety margin
 */
const GLOBAL_MIN_Z_DEPTH = -200;
const GLOBAL_MAX_Z_DEPTH = 200;

/**
 * Calculate z-index based on Z depth - higher z-index for objects closer to viewer
 * Maps Z depth to z-index range [0, 1000] where higher Z = higher z-index
 * Uses global range to ensure consistent stacking across all celestial bodies
 */
export function calcZIndex(zDepth: number, minZDepth?: number, maxZDepth?: number): number {
  // Use global range if not provided, otherwise use provided range
  const effectiveMinZ = minZDepth !== undefined ? minZDepth : GLOBAL_MIN_Z_DEPTH;
  const effectiveMaxZ = maxZDepth !== undefined ? maxZDepth : GLOBAL_MAX_Z_DEPTH;
  
  // Normalize Z depth to 0-1 range
  const normalizedZ = (zDepth - effectiveMinZ) / (effectiveMaxZ - effectiveMinZ); // 0 to 1
  // Map to z-index range [0, 1000] - objects closer (higher Z) get higher z-index
  const zIndex = Math.round(normalizedZ * 1000);
  return zIndex;
}

/**
 * Generate orbital transform string for a simple orbit (like planets)
 */
export function generateSimpleOrbitTransform(
  progress: number,
  config: OrbitalConfig,
  zDepthConfig: ZDepthConfig
): string {
  const angle = getOrbitalAngle(progress, config.initialAngle);
  const zDepth = calcZDepth(angle, zDepthConfig.depthScale);
  
  const depthScale = zDepthConfig.depthScale;
  const minZDepth = -depthScale;
  const maxZDepth = depthScale;
  const scale = calcScale(zDepth, minZDepth, maxZDepth);
  
  const tilt = config.tiltAngle ?? 0;
  const counterTilt = -tilt;
  const offsetY = config.offsetY ?? 0;
  
  // Transform order: translate to center -> tilt orbital plane -> rotate -> move along orbit -> adjust depth -> counter-rotate
  return `translate(-50%, -50%) rotateX(${tilt}deg) rotate(${angle}deg) translateX(${config.orbitRadius}px) translateY(${offsetY}px) translateZ(${zDepth}px) rotate(-${angle}deg) rotateX(${counterTilt}deg) scale3d(${scale}, ${scale}, ${scale})`;
}


/**
 * Generate CSS keyframes for an orbital animation
 * getTransform can return either a string or an object with transform and zIndex
 */
export function generateOrbitalKeyframes(
  animationName: string,
  numKeyframes: number,
  getTransform: (progress: number) => string | { transform: string; zIndex?: number }
): string {
  const keyframeSteps: string[] = [];
  let minZDepth = Infinity;
  let maxZDepth = -Infinity;
  const zDepths: number[] = [];
  
  // First pass: collect all Z depths to calculate range
  for (let i = 0; i <= numKeyframes; i++) {
    const progress = i / numKeyframes;
    const result = getTransform(progress);
    if (typeof result === 'object' && result.zIndex !== undefined) {
      // If zIndex is provided, use it directly
      zDepths.push(result.zIndex);
    } else {
      // Extract Z depth from transform string
      const transformStr = typeof result === 'string' ? result : result.transform;
      const zMatch = transformStr.match(/translateZ\(([-\d.]+)px\)/);
      if (zMatch) {
        const zDepth = parseFloat(zMatch[1]);
        zDepths.push(zDepth);
        minZDepth = Math.min(minZDepth, zDepth);
        maxZDepth = Math.max(maxZDepth, zDepth);
      }
    }
  }
  
  // If we have a range, use it; otherwise use default
  if (minZDepth === Infinity) {
    minZDepth = -100;
    maxZDepth = 100;
  }
  
  // Second pass: generate keyframes with z-index
  for (let i = 0; i <= numKeyframes; i++) {
    const progress = i / numKeyframes;
    const percentage = progress * 100;
    const result = getTransform(progress);
    const transformStr = typeof result === 'string' ? result : result.transform;
    
    let zIndex: number;
    if (typeof result === 'object' && result.zIndex !== undefined) {
      zIndex = result.zIndex;
    } else if (zDepths[i] !== undefined) {
      zIndex = calcZIndex(zDepths[i], minZDepth, maxZDepth);
    } else {
      // Fallback: extract from transform
      const zMatch = transformStr.match(/translateZ\(([-\d.]+)px\)/);
      if (zMatch) {
        const zDepth = parseFloat(zMatch[1]);
        zIndex = calcZIndex(zDepth, minZDepth, maxZDepth);
      } else {
        zIndex = 500; // Default middle value
      }
    }
    
    keyframeSteps.push(`${percentage}% { transform: ${transformStr}; z-index: ${zIndex}; }`);
  }
  
  return `
    @keyframes ${animationName} {
      ${keyframeSteps.join('\n      ')}
    }
  `;
}

/**
 * Get initial transform for a simple orbit (matches 0% keyframe)
 */
export function getSimpleOrbitInitialTransform(
  config: OrbitalConfig,
  zDepthConfig: ZDepthConfig
): string {
  return generateSimpleOrbitTransform(0, config, zDepthConfig);
}

