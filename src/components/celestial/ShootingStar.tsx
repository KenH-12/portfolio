import { useState, useRef, useEffect } from "react";

interface ShootingStarProps {
  startX?: number; // Start position X (percentage) - optional, will be randomized
  startY?: number; // Start position Y (percentage) - optional, will be randomized
  angle?: number; // Direction of travel (degrees) - optional, will be randomized
  moveX?: number; // Movement distance X (pixels) - optional, will be randomized
  moveY?: number; // Movement distance Y (pixels) - optional, will be randomized
  length?: number; // Length of the streak (pixels) - optional, will be randomized
  height?: number; // Height/thickness of the streak (pixels) - optional, will be randomized
  duration?: number; // Animation duration (seconds) - optional, will be randomized
  delay?: number; // Animation delay (seconds)
  intensity?: number; // Brightness multiplier (0-1) - optional, will be randomized
  animationName?: string; // Unique name for keyframes
}

interface StarProperties {
  startX: number;
  startY: number;
  angle: number;
  moveX: number;
  moveY: number;
  length: number;
  height: number;
  duration: number;
  delay: number;
  intensity: number;
}

function generateRandomProperties(): StarProperties {
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
  const delay = Math.random() * 15 + 5; // 5-20s delay (longer interval between appearances)
  const intensity = Math.random() * 0.3 + 0.7; // 0.7-1.0
  
  return {
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
  };
}

export function ShootingStar({
  startX: initialStartX,
  startY: initialStartY,
  angle: initialAngle,
  moveX: initialMoveX,
  moveY: initialMoveY,
  length: initialLength,
  height: initialHeight,
  duration: initialDuration,
  delay = 0,
  intensity: initialIntensity,
  animationName = `shooting-star-${Math.random().toString(36).substring(7)}`,
}: ShootingStarProps) {
  const [properties, setProperties] = useState<StarProperties>(() => {
    // Use provided props or generate random ones
    if (
      initialStartX !== undefined &&
      initialStartY !== undefined &&
      initialAngle !== undefined &&
      initialMoveX !== undefined &&
      initialMoveY !== undefined
    ) {
      return {
        startX: initialStartX,
        startY: initialStartY,
        angle: initialAngle,
        moveX: initialMoveX,
        moveY: initialMoveY,
        length: initialLength ?? 150,
        height: initialHeight ?? 8,
        duration: initialDuration ?? 1,
        delay: delay, // Use provided delay for initial render
        intensity: initialIntensity ?? 1,
      };
    }
    const randomProps = generateRandomProperties();
    return {
      ...randomProps,
      delay: delay !== 0 ? delay : randomProps.delay, // Use provided delay if not 0, otherwise use random
    };
  });

  const [cycle, setCycle] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  // Regenerate properties on each animation iteration
  const handleAnimationIteration = () => {
    setProperties(generateRandomProperties());
    setCycle((prev) => prev + 1);
  };

  // Update keyframes when properties change
  useEffect(() => {
    const animationKeyframes = `
      @keyframes ${animationName} {
        0% {
          transform: translate(${-properties.moveX}px, ${-properties.moveY}px) rotate(${properties.angle}deg);
          opacity: 0;
        }
        10% {
          transform: translate(${properties.moveX * -0.8}px, ${properties.moveY * -0.8}px) rotate(${properties.angle}deg);
          opacity: ${properties.intensity};
        }
        80% {
          transform: translate(${properties.moveX * 0.6}px, ${properties.moveY * 0.6}px) rotate(${properties.angle}deg);
          opacity: ${properties.intensity};
        }
        100% {
          transform: translate(${properties.moveX}px, ${properties.moveY}px) rotate(${properties.angle}deg);
          opacity: 0;
        }
      }
    `;

    // Inject or update keyframes in the document
    const styleId = `${animationName}-keyframes`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = animationKeyframes;

    // Update the element's animation and styles
    if (elementRef.current) {
      elementRef.current.style.animation = `none`;
      // Force reflow to reset animation
      void elementRef.current.offsetWidth;
      elementRef.current.style.animation = `${animationName} ${properties.duration}s linear infinite`;
      elementRef.current.style.animationDelay = `${properties.delay}s`;
      elementRef.current.style.opacity = `0`; // Invisible when not animating
      elementRef.current.style.left = `${properties.startX}%`;
      elementRef.current.style.top = `${properties.startY}%`;
      elementRef.current.style.width = `${properties.length}px`;
      elementRef.current.style.height = `${properties.height}px`;
      elementRef.current.style.background = `linear-gradient(to right, transparent 0%, rgba(255, 255, 255, ${0.3 * properties.intensity}) 40%, rgba(255, 255, 255, ${0.8 * properties.intensity}) 80%, rgba(255, 255, 255, ${1 * properties.intensity}) 100%)`;
      elementRef.current.style.boxShadow = `0 0 ${10 * properties.intensity}px rgba(255, 255, 255, ${0.8 * properties.intensity}), 0 0 ${20 * properties.intensity}px rgba(255, 255, 255, ${0.4 * properties.intensity})`;
    }
  }, [properties, animationName]);

  return (
    <>
      <div
        ref={elementRef}
        className="absolute"
        onAnimationIteration={handleAnimationIteration}
        style={{
          transformOrigin: "right center",
          clipPath: "polygon(0% 0%, 0% 100%, 100% 50%)",
          opacity: 0, // Invisible when not animating
        }}
      />
    </>
  );
}
