import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/modules/auth';

import { FadeUp, Float } from '@/shared/motion/LandingMotion';

const CtaSection = () => {
  const { isUser, homePath } = useAuth();

  return (
    <section className="bg-deep-blue py-16 lg:py-20">
      <Container className="text-center">
        <FadeUp>
          <h2 className="mx-auto  text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[36px] xl:text-[40px]">
            Join the Laboratory Professional Network
          </h2>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.65] text-white/85 lg:mt-5 lg:text-[16px] lg:leading-[1.7] xl:max-w-[560px]">
            Registration is free and takes under two minutes.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            No payment details required during the trial period.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          {isUser ? (
            <Link
              to={homePath}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#F7F8FA] px-6 py-3 text-[15px] font-semibold text-deep-blue transition-opacity hover:opacity-90 lg:mt-9 lg:px-7 lg:py-3.5 lg:text-[16px] xl:mt-10"
            >
              Go to Dashboard
              <Float y={2} duration={2.5} className="inline-flex">
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Float>
            </Link>
          ) : (
            <Link
              to="/join"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#F7F8FA] px-6 py-3 text-[15px] font-semibold text-deep-blue transition-opacity hover:opacity-90 lg:mt-9 lg:px-7 lg:py-3.5 lg:text-[16px] xl:mt-10"
            >
              Create your free account
              <Float y={2} duration={2.5} className="inline-flex">
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Float>
            </Link>
          )}
        </FadeUp>
      </Container>
    </section>
  );
};

export default CtaSection;
