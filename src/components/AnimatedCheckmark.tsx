export default function AnimatedCheckmark({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 52 52"
      width={size}
      height={size}
      className="mx-auto"
      role="img"
      aria-label="Succès"
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--gn-gold)"
        strokeWidth="2.5"
        pathLength={1}
        className="gn-checkmark-circle"
      />
      <path
        d="M15 27 L23 35 L38 18"
        fill="none"
        stroke="var(--gn-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="gn-checkmark-tick"
      />
    </svg>
  );
}
