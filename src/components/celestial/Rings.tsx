interface RingsProps {
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  ringRadius?: number;
  ringTiltAngle?: number;
  size: number;
}

// Convert rgb() to rgba() with opacity
function rgbToRgba(rgb: string, opacity: number): string {
  const match = rgb.match(/\d+/g);
  if (match && match.length >= 3) {
    return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
  }
  return rgb;
}

export function Rings({
  gradientColors,
  ringRadius,
  ringTiltAngle = 0,
  size,
}: RingsProps) {
  const radius = ringRadius ?? size * 2.5;
  const ringColor1 = rgbToRgba(gradientColors.from, 0.4);
  const ringColor2 = rgbToRgba(gradientColors.via, 0.3);
  const ringColor3 = rgbToRgba(gradientColors.to, 0.25);

  // Clip to show ring everywhere except the top half of the planet circle (evenodd = rect minus semicircle).
  const cx = radius / 2;
  const cy = radius / 2;
  const pr = size / 2;
  const clipPath = `path(evenodd, "M 0 0 L ${radius} 0 L ${radius} ${radius} L 0 ${radius} Z M ${cx - pr} ${cy} A ${pr} ${pr} 0 0 0 ${cx + pr} ${cy} L ${cx} ${cy} Z")`;

  return (
    <div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: `${radius}px`,
        height: `${radius}px`,
        marginLeft: `${-radius / 2}px`,
        marginTop: `${-radius / 2}px`,
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotateX(75deg) rotateZ(${ringTiltAngle}deg) scaleY(0.32)`,
          transformStyle: "preserve-3d",
        }}
      >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${ringColor1}`,
          boxShadow: `
            0 0 4px ${rgbToRgba(gradientColors.from, 0.3)},
            inset 0 0 8px ${rgbToRgba(gradientColors.from, 0.2)}
          `,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: "85%",
          height: "85%",
          left: "7.5%",
          top: "7.5%",
          border: `1px solid ${ringColor2}`,
          boxShadow: `
            0 0 3px ${rgbToRgba(gradientColors.via, 0.2)},
            inset 0 0 6px ${rgbToRgba(gradientColors.via, 0.15)}
          `,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: "70%",
          height: "70%",
          left: "15%",
          top: "15%",
          border: `1px solid ${ringColor3}`,
          boxShadow: `
            0 0 2px ${rgbToRgba(gradientColors.to, 0.15)},
            inset 0 0 4px ${rgbToRgba(gradientColors.to, 0.1)}
          `,
        }}
      />
      </div>
    </div>
  );
}
