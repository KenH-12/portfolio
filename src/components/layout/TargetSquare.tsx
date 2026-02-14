interface TargetSquareProps {
  isMobile: boolean;
  shouldShowSquare: boolean;
  isTransitioning: boolean;
  isReversing: boolean;
}

export function TargetSquare({
  isMobile,
  shouldShowSquare,
  isTransitioning,
  isReversing,
}: TargetSquareProps) {
  // TargetSquare must be visible immediately when transitioning starts (no fade-in)
  // It should be visible during transition even if shouldShowSquare is false
  // This ensures FocusedPlanet can use its position immediately
  // Always keep in DOM (even when hidden) so position can be calculated
  const isVisible = shouldShowSquare || (isTransitioning && !isReversing);
  
  return (
    <>
      <div
        data-planet-target
        className={`pointer-events-none target-square ${isMobile ? 'hidden' : ''}`}
        style={{
          borderWidth: '1px',
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          // Visible immediately when transitioning starts (no fade-in, no animation)
          // Use visibility to keep in layout for position calculation, opacity for visual state
          visibility: isMobile ? 'hidden' : 'visible',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0s', // Instant transition, no delay
          zIndex: 5,
          alignSelf: 'flex-start', // Align to top of flex container
        }}
      />
    </>
  );
}
