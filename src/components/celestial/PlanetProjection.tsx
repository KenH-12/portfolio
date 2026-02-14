import { useEffect, useRef, useState } from 'react';

const SOLAR_SYSTEM_SCALE_1920 = 1.5;

interface PlanetProjectionProps {
  originalPlanetPosition: { x: number; y: number } | null;
  originalPlanetSize: number;
  focusedPlanetPosition: { x: number; y: number } | null;
  focusedPlanetSize: number;
  color?: string;
  /** At min-width 1920px, original box size is multiplied by this (defaults to 1.5 to match Hero). */
  solarSystemScale?: number;
}

export function PlanetProjection({
  originalPlanetPosition,
  originalPlanetSize,
  focusedPlanetPosition,
  focusedPlanetSize,
  color = 'hsla(174, 72%, 56%, 0.4)',
  solarSystemScale = SOLAR_SYSTEM_SCALE_1920,
}: PlanetProjectionProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLargeDesktop, setIsLargeDesktop] = useState(
    () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 1920px)").matches : false)
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1920px)");
    const onChange = () => setIsLargeDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    setIsLargeDesktop(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const updateSize = () => {
        const container = svgRef.current?.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          setContainerSize({
            width: rect.width,
            height: rect.height,
          });
        }
      };
      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      if (svgRef.current.parentElement) {
        resizeObserver.observe(svgRef.current.parentElement);
      }
      window.addEventListener('resize', updateSize);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateSize);
      };
    }
  }, []);

  if (!originalPlanetPosition || !focusedPlanetPosition) {
    return null;
  }

  // Calculate box corners for original planet (centered at position)
  const baseBoxSize = originalPlanetSize + 16; // Add padding around planet
  const originalBoxSize = isLargeDesktop ? baseBoxSize * solarSystemScale : baseBoxSize;
  const originalCorners = {
    topLeft: {
      x: originalPlanetPosition.x - originalBoxSize / 2,
      y: originalPlanetPosition.y - originalBoxSize / 2,
    },
    topRight: {
      x: originalPlanetPosition.x + originalBoxSize / 2,
      y: originalPlanetPosition.y - originalBoxSize / 2,
    },
    bottomLeft: {
      x: originalPlanetPosition.x - originalBoxSize / 2,
      y: originalPlanetPosition.y + originalBoxSize / 2,
    },
    bottomRight: {
      x: originalPlanetPosition.x + originalBoxSize / 2,
      y: originalPlanetPosition.y + originalBoxSize / 2,
    },
  };

  // Calculate box corners for focused planet (centered at position)
  const focusedBoxSize = focusedPlanetSize + 20; // Add padding around planet
  const focusedCorners = {
    topLeft: {
      x: focusedPlanetPosition.x - focusedBoxSize / 2,
      y: focusedPlanetPosition.y - focusedBoxSize / 2,
    },
    topRight: {
      x: focusedPlanetPosition.x + focusedBoxSize / 2,
      y: focusedPlanetPosition.y - focusedBoxSize / 2,
    },
    bottomLeft: {
      x: focusedPlanetPosition.x - focusedBoxSize / 2,
      y: focusedPlanetPosition.y + focusedBoxSize / 2,
    },
    bottomRight: {
      x: focusedPlanetPosition.x + focusedBoxSize / 2,
      y: focusedPlanetPosition.y + focusedBoxSize / 2,
    },
  };

  // Use container size or fallback to viewport
  const svgWidth = containerSize.width > 0 ? containerSize.width : (typeof window !== 'undefined' ? window.innerWidth : 1920);
  const svgHeight = containerSize.height > 0 ? containerSize.height : (typeof window !== 'undefined' ? window.innerHeight : 1080);

  return (
    <svg
      ref={svgRef}
      className="absolute pointer-events-none z-40"
      style={{ 
        left: 0,
        top: 0,
        width: svgWidth,
        height: svgHeight,
      }}
    >
      {/* Original planet box */}
      <rect
        x={originalCorners.topLeft.x}
        y={originalCorners.topLeft.y}
        width={originalBoxSize}
        height={originalBoxSize}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      
      {/* Focused planet box */}
      <rect
        x={focusedCorners.topLeft.x}
        y={focusedCorners.topLeft.y}
        width={focusedBoxSize}
        height={focusedBoxSize}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Connection lines from original to focused planet corners */}
      <line
        x1={originalCorners.topLeft.x}
        y1={originalCorners.topLeft.y}
        x2={focusedCorners.topLeft.x}
        y2={focusedCorners.topLeft.y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
      <line
        x1={originalCorners.topRight.x}
        y1={originalCorners.topRight.y}
        x2={focusedCorners.topRight.x}
        y2={focusedCorners.topRight.y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
      <line
        x1={originalCorners.bottomLeft.x}
        y1={originalCorners.bottomLeft.y}
        x2={focusedCorners.bottomLeft.x}
        y2={focusedCorners.bottomLeft.y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
      <line
        x1={originalCorners.bottomRight.x}
        y1={originalCorners.bottomRight.y}
        x2={focusedCorners.bottomRight.x}
        y2={focusedCorners.bottomRight.y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
    </svg>
  );
}
