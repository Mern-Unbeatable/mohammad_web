/** Blinking dots; tune with the `--duration` and `--delay` CSS variables. */
const Dots = ({ className = "", dots = 3, label = "Loading", ...props }) => (
  <span
    role="status"
    className={`inline-flex items-center justify-center gap-[12%] ${className}`}
    {...props}
  >
    {Array.from({ length: dots }, (_, index) => (
      <span
        key={index}
        data-slot="dot"
        aria-hidden="true"
        style={{
          animation: "loading-ui-dots-blink var(--duration, 1.4s) infinite both",
          animationDelay: `calc(var(--delay, 0.2s) * ${index})`,
        }}
        className="aspect-square grow rounded-full bg-current"
      />
    ))}
    {label ? <span className="sr-only">{label}</span> : null}
  </span>
);

export default Dots;
