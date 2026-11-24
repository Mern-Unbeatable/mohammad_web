import { motion, useReducedMotion } from "framer-motion";
import { landingEase, landingViewport } from "@/shared/motion/LandingMotion";

const MotionLine = motion.line;
const MotionCircle = motion.circle;
const MotionDiv = motion.div;

const VIEW_W = 320;
const VIEW_H = 220;

const NODES = [
  { id: "suppliers", label: "Suppliers", x: 60, y: 55, avatar: 0 },
  { id: "lab-managers", label: "Lab managers", x: 260, y: 55, avatar: 2 },
  { id: "professionals", label: "Professionals", x: 160, y: 150, avatar: 1 },
];

const nodeById = Object.fromEntries(NODES.map((node) => [node.id, node]));

const EDGES = [
  ["suppliers", "lab-managers"],
  ["suppliers", "professionals"],
  ["lab-managers", "professionals"],
].map(([from, to]) => ({ id: `${from}-${to}`, a: nodeById[from], b: nodeById[to] }));

/** Triangle of member types joined by animated connection lines. */
const ConnectNetwork = ({ avatars }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[32/22] w-full max-w-[420px] text-primary">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {EDGES.map(({ id, a, b }, index) => (
          <g key={id}>
            <MotionLine
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#D5DEE8"
              strokeOpacity={1}
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={landingViewport}
              transition={{ duration: 0.9, delay: 0.2 + index * 0.25, ease: landingEase }}
            />
            {reduceMotion ? null : (
              <>
                <MotionLine
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="currentColor"
                  strokeOpacity={0.55}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="4 10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={landingViewport}
                  animate={{ strokeDashoffset: [0, -28] }}
                  transition={{
                    opacity: { duration: 0.4, delay: 1 + index * 0.25 },
                    strokeDashoffset: { duration: 1.4, repeat: Infinity, ease: "linear" },
                  }}
                />
                <MotionCircle
                  r={4}
                  fill="currentColor"
                  initial={{ cx: a.x, cy: a.y, opacity: 0 }}
                  animate={{
                    cx: [a.x, b.x],
                    cy: [a.y, b.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    delay: 1.2 + index * 0.8,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                    opacity: { times: [0, 0.15, 0.85, 1] },
                  }}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {NODES.map((node, index) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(node.x / VIEW_W) * 100}%`, top: `${(node.y / VIEW_H) * 100}%` }}
        >
          <MotionDiv
            initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={landingViewport}
            transition={{ duration: 0.5, delay: index * 0.12, ease: landingEase }}
          >
            <img
              src={avatars[node.avatar]}
              alt=""
              className="h-14 w-14 rounded-full object-cover shadow-md ring-[3px] ring-white transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16 xl:h-[72px] xl:w-[72px]"
            />
          </MotionDiv>
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-deep-blue shadow-sm ring-1 ring-black/5 xl:text-[12px]">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ConnectNetwork;
