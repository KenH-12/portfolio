import { useEffect, useRef } from "react";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Returns the shortest rotation delta in degrees from current to target (both 0-360). */
function shortestDelta(current: number, target: number): number {
  let d = ((target - current + 360) % 360 + 360) % 360;
  if (d > 180) d -= 360;
  return d;
}

/** Angle in degrees (0 = up, clockwise) from element center to point (px, py). */
function angleFromCenterToPoint(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  const deg =
    (Math.atan2(pointX - centerX, centerY - pointY) * 180) / Math.PI;
  return ((deg - 28 % 360) + 360) % 360;
}

const MOUSE_SAMPLE_INTERVAL_MS = 3000;
const ROTATION_DURATION_MS = 2000;

interface RotatingSatelliteProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Offset in degrees to align with the satellite image's dish (default 0). */
  signalDirectionOffsetDeg?: number;
}

/**
 * Rotates to point toward the mouse. Samples mouse position every 3 seconds
 * and eases the satellite to that angle.
 */
export function RotatingSatellite({
  children,
  className,
  style,
  signalDirectionOffsetDeg = 0,
}: RotatingSatelliteProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const currentAngleRef = useRef(0);
  const startAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const deltaRef = useRef(0);
  const durationRef = useRef(ROTATION_DURATION_MS);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    function setTargetFromMouse() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const mx = mouseXRef.current;
      const my = mouseYRef.current;
      const targetAngle = angleFromCenterToPoint(cx, cy, mx, my);
      const currentNorm =
        ((Math.round(currentAngleRef.current) % 360) + 360) % 360;
      startAngleRef.current = currentAngleRef.current;
      targetAngleRef.current = targetAngle;
      deltaRef.current = shortestDelta(currentNorm, targetAngle);
      durationRef.current = ROTATION_DURATION_MS;
      startTimeRef.current = performance.now();
    }

    setTargetFromMouse();
    const intervalId = setInterval(setTargetFromMouse, MOUSE_SAMPLE_INTERVAL_MS);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let rafId: number;

    function tick(now: number) {
      const startTime = startTimeRef.current;
      const duration = durationRef.current;
      const startAngle = startAngleRef.current;
      const delta = deltaRef.current;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      const currentAngle = startAngle + delta * eased;
      currentAngleRef.current = currentAngle;

      el.style.transform = `rotate(${currentAngle}deg)`;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
