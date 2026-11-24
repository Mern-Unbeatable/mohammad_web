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
