import { Link } from 'react-router';
import { Check } from 'lucide-react';
import heroImage from '@/assets/hero.png';
import Container from '@/components/ui/Container';
import { useAuth } from '@/modules/auth';

import { FadeUp, Float, Pulse } from '@/shared/motion/LandingMotion';

const features = [
  'Research-focused',
  'Professional community',
  'Built for the laboratory industry',
];

const EXPLORE_SECTION_ID = 'community';

const scrollToExploreSection = (event) => {
  const section = document.getElementById(EXPLORE_SECTION_ID);
  if (!section) return;
  event.preventDefault();
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${EXPLORE_SECTION_ID}`);
};

const HeroSection = () => {
  const { isUser, homePath } = useAuth();

  return (
    <section id="platform" className="relative scroll-mt-[72px] overflow-hidden bg-white lg:scroll-mt-[76px] xl:scroll-mt-[84px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-full w-[55%] bg-[radial-gradient(ellipse_at_left,rgba(8,118,196,0.08)_0%,rgba(240,246,252,0.6)_45%,transparent_75%)] lg:w-[48%] xl:w-[55%]"
      />

      <Container className="relative grid grid-cols-1 items-center gap-10 py-14 sm:gap-12 lg:grid-cols-2 lg:items-start lg:gap-8 lg:py-16 xl:grid-cols-[1fr_1.08fr] xl:items-center xl:gap-12 xl:py-28">
        <div className="w-full max-w-[540px] lg:max-w-[420px] xl:max-w-none">
          <FadeUp inView={false} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-1.5 xl:mb-8 xl:gap-2.5 xl:px-4 xl:py-2">
            <Pulse className="h-2 w-2 shrink-0 rounded-full bg-pink-light xl:h-2.5 xl:w-2.5" duration={2.2} scale={0.85} />
            <span className="text-[13px] font-normal leading-none text-[#4B5563] xl:text-[14px]">
              The professional network for laboratories
            </span>
          </FadeUp>

          <FadeUp inView={false} delay={0.1}>
            <h1 className="text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[42px] lg:text-[38px] lg:leading-[1.2] xl:text-[56px] xl:leading-[1.15]">
              Where Laboratory Professionals{' '}
              <span className="text-pink-light">Connect,</span> Collaborate &{' '}
              <span className="text-primary">Move Science Forward.</span>
            </h1>
          </FadeUp>

          <FadeUp inView={false} delay={0.2}>
            <p className="mt-5 max-w-[500px] text-[16px] leading-[1.65] text-[#6B7280] lg:mt-4 lg:max-w-none lg:text-[15px] lg:leading-[1.6] xl:mt-6 xl:max-w-[620px] xl:text-[18px] xl:leading-[1.7]">
              Lab Unity brings laboratories, researchers, suppliers, and industry
              professionals together in one trusted professional environment to
              exchange knowledge, discover opportunities, and build meaningful
              connections.
            </p>
          </FadeUp>

          <FadeUp inView={false} delay={0.32}>
            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-6 lg:gap-2.5 xl:mt-10 xl:gap-4">
              {isUser ? (
                <Link
                  to={homePath}
                  className="rounded-full bg-primary px-7 py-3 text-[15px] font-medium leading-none text-white transition-opacity hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-[14px] xl:px-9 xl:py-3.5 xl:text-[16px]"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/join"
                  className="rounded-full bg-primary px-7 py-3 text-[15px] font-medium leading-none text-white transition-opacity hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-[14px] xl:px-9 xl:py-3.5 xl:text-[16px]"
                >
                  Join Lab Unity
                </Link>
              )}
              <Link
                to={`/#${EXPLORE_SECTION_ID}`}
                onClick={scrollToExploreSection}
                className="rounded-full bg-secondary px-7 py-3 text-[15px] font-medium leading-none text-deep-blue transition-colors hover:bg-[#E3EEF8] lg:px-6 lg:py-2.5 lg:text-[14px] xl:px-9 xl:py-3.5 xl:text-[16px]"
              >
                Explore Network
              </Link>
            </div>
          </FadeUp>

          <FadeUp inView={false} delay={0.44}>
            <ul className="mt-8 flex flex-col gap-y-2.5 lg:mt-6 xl:mt-10 xl:flex-row xl:flex-wrap xl:gap-x-10 xl:gap-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-[14px] font-normal text-green-primary lg:text-[13px] xl:text-[15px]"
                >
                  <Check className="h-4 w-4 shrink-0 stroke-[2.5] lg:h-3.5 lg:w-3.5 xl:h-[18px] xl:w-[18px]" />
                  {feature}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        <FadeUp inView={false} delay={0.56} className="relative w-full lg:pt-2 xl:pt-0">
          <Float y={10} duration={6}>
            <img
              src={heroImage}
              alt="Laboratory professionals collaborating around a tablet"
              className="w-full rounded-2xl object-cover shadow-[0_20px_50px_rgba(10,26,68,0.08)] lg:aspect-[5/4] lg:max-h-[360px] lg:rounded-2xl xl:max-h-none xl:min-h-[520px] xl:rounded-3xl xl:aspect-[5/4]"
            />
          </Float>
        </FadeUp>
      </Container>
    </section>
  );
};

export default HeroSection;
