import { motion, useReducedMotion } from "framer-motion";

export const landingEase = [0.22, 1, 0.36, 1];

export const landingViewport = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -32px 0px",
};

export const landingFadeTransition = (delay = 0) => ({
  duration: 0.65,
  delay,
  ease: landingEase,
});

export const landingFloatTransition = (duration = 5.5, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut",
});

export const landingPulseTransition = (duration = 2.8, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut",
});

const motionTags = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
};

export const FadeUp = ({
  children,
  className = "",
  delay = 0,
  inView = true,
  as = "div",
}) => {
  const reduceMotion = useReducedMotion();
  const Tag = motionTags[as] ?? motion.div;

  if (reduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const motionProps = inView
    ? {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: landingViewport,
      }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <Tag
      className={className}
      {...motionProps}
      transition={landingFadeTransition(delay)}
    >
      {children}
    </Tag>
  );
};

export const Float = ({
  children,
  className = "",
  y = 8,
  duration = 5.5,
  delay = 0,
}) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0] }}
      transition={landingFloatTransition(duration, delay)}
    >
      {children}
    </motion.div>
  );
};

export const Pulse = ({
  children,
  className = "",
  duration = 2.8,
  delay = 0,
  scale = 0.92,
}) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
        opacity: [1, 0.72, 1],
      }}
      transition={landingPulseTransition(duration, delay)}
    >
      {children}
    </motion.div>
  );
};

export const RingPulse = ({ className = "", duration = 5, delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className} />;
  }

  return (
    <motion.div
      className={className}
      style={{ translateX: "-50%", translateY: "-50%" }}
      animate={{
        scale: [1, 0.88, 1],
        opacity: [1, 0.65, 1],
      }}
      transition={landingPulseTransition(duration, delay)}
    />
  );
};
