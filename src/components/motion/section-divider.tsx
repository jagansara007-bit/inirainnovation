export function SectionDivider() {
  return (
    <div className="pointer-events-none relative h-16 overflow-hidden text-charcoal-lift" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path
          d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
          fill="currentColor"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
