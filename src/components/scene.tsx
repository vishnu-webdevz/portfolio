/* Static decorations for the header and hero. */

/** Plant on the far end of the ledge. */
export function LedgeProps() {
  return (
    <svg className="absolute bottom-0 right-[6%] w-10 sm:right-[12%] sm:w-14" viewBox="0 0 56 80" aria-hidden="true">
      <path d="M28 44C26 30 14 26 6 28c6 10 14 14 22 16z" fill="#3f6b3a" />
      <path d="M28 44c2-16 14-22 24-20-4 12-14 18-24 20z" fill="#4e8048" />
      <path d="M28 46C28 28 30 12 36 4c4 14-2 30-8 42z" fill="#5c9455" />
      <path d="M10 46h36l-5 34H15z" fill="#c4532d" />
      <rect x="8" y="44" width="40" height="7" rx="2" fill="#a8441f" />
    </svg>
  );
}
