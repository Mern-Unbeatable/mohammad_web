import { useEffect, useState } from 'react';
import {
  Box,
  Briefcase,
  CalendarDays,
  MessageSquare,
  SendHorizontal,
  ShoppingBag,
  User,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { FadeUp } from '@/shared/motion/LandingMotion';
import {
  CONNECT_AVATARS as chatAvatars,
  HOME_SECTIONS,
  KNOWLEDGE_TAGS as knowledgeTags,
  MARKETPLACE_ITEMS as marketplaceItems,
  NETWORK_NODES as networkNodes,
  NETWORK_STATS as stats,
} from '../../constant/constants';

const cardLabel = 'text-[10px] font-semibold uppercase tracking-[0.12em] xl:text-[11px]';
const cardHeading = 'mt-2 text-[16px] font-bold leading-snug text-deep-blue xl:text-[18px]';
const cardText = 'mt-1.5 text-[13px] leading-[1.6] text-[#64748B] xl:text-[14px] xl:leading-[1.65]';

const cardBase =
  'rounded-2xl border border-[#E8ECF0] bg-white transition-all duration-300 hover:border-[#D8DEE6] hover:shadow-md';

const MotionDiv = motion.div;

const NETWORK_RINGS = [
  {
    size: 'h-[260px] w-[260px] sm:h-[300px] sm:w-[300px] xl:h-[340px] xl:w-[340px]',
    border: 'border-dashed border-[#DCE2EA]',
    dot: 'bg-primary',
    duration: 40,
  },
  {
    size: 'h-[190px] w-[190px] sm:h-[220px] sm:w-[220px] xl:h-[250px] xl:w-[250px]',
    border: 'border-[#E6EAF0]',
    dot: 'bg-pink-light',
    duration: 28,
    reverse: true,
  },
  {
    size: 'h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] xl:h-[160px] xl:w-[160px]',
    border: 'border-dashed border-[#DCE2EA]',
    dot: 'bg-green-primary',
    duration: 18,
  },
];

const OrbitRing = ({ size, border, dot, duration, reverse = false }) => {
  const reduceMotion = useReducedMotion();
  return (
    <MotionDiv
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${border} ${size}`}
      animate={reduceMotion ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      <span
        className={`absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${dot}`}
      />
    </MotionDiv>
  );
};

const COMPOSER_PHRASES = [
  'Thanks! Reviewing it now…',
  'Can we schedule a call tomorrow?',
  'Sharing the validation data…',
];

const useTypewriter = (phrases, enabled) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const full = phrases[index];
    let delay = deleting ? 35 : 70;
    let next;

    if (!deleting && text === full) {
      delay = 1600;
      next = () => setDeleting(true);
    } else if (deleting && text === '') {
      delay = 400;
      next = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      };
    } else {
      next = () =>
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }

    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [phrases, index, text, deleting, enabled]);

  return enabled ? text : phrases[0];
};

const TypingComposer = () => {
  const reduceMotion = useReducedMotion();
  const text = useTypewriter(COMPOSER_PHRASES, !reduceMotion);

  return (
    <div
      aria-hidden="true"
      className="mt-4 flex items-center gap-2 rounded-full border border-[#E6EAF0] bg-[#F8FAFC] py-1.5 pl-4 pr-1.5"
    >
      <p className="min-w-0 flex-1 truncate text-[12px] text-deep-blue xl:text-[13px]">
        {text}
        <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-deep-blue" />
      </p>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-light text-white xl:h-8 xl:w-8">
        <SendHorizontal className="h-3.5 w-3.5" strokeWidth={2.25} />
      </span>
    </div>
  );
};

const FeatureCard = ({ icon, iconColor, label, heading, text, delay, children }) => {
  const Icon = icon;
  return (
    <FadeUp as="article" delay={delay} className={`${cardBase} flex flex-col p-6 lg:p-5 xl:p-7`}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} strokeWidth={2.5} />
        <p className={`${cardLabel}`} style={{ color: iconColor }}>
          {label}
        </p>
      </div>
      <h3 className={cardHeading}>{heading}</h3>
      <p className={cardText}>{text}</p>
      <div className="mt-4 flex-1 xl:mt-5">{children}</div>
    </FadeUp>
  );
};

const EcosystemSection = () => {
  return (
    <section
      id={HOME_SECTIONS.MARKETPLACE}
      className="scroll-mt-[72px] bg-gradient-to-b from-[#F7F8FA] via-[#FAFBFC] to-[#F7F8FA] py-14 lg:scroll-mt-[76px] lg:py-16 xl:scroll-mt-[84px] xl:py-24"
    >
      <Container>
        {/* Header */}
        <FadeUp className="mb-10 lg:mb-12 xl:mb-14">
          <p className={`${cardLabel} inline-flex items-center gap-2 text-pink-light`}>
            <span className="h-1.5 w-1.5 rounded-full bg-pink-light" />
            One professional ecosystem
          </p>
          <h2 className="mt-3 max-w-[720px] text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-deep-blue sm:text-[32px] lg:text-[34px] xl:text-[42px]">
            From Research To Opportunity, All In One Place.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch xl:gap-6">
          {/* Network Card */}
          <article className={`${cardBase} flex h-full flex-col p-6 lg:p-7 xl:p-8`}>
            <p className={`${cardLabel} text-primary`}>Core</p>
            <h3 className={cardHeading}>Professional Network</h3>
            <p className={cardText}>
              Researchers, laboratories and suppliers linked in one verified professional graph.
            </p>

            <div className="relative mx-auto my-6 h-[360px] w-full max-w-[540px] lg:my-7 lg:h-[380px] xl:my-8 xl:h-[420px]">
              {NETWORK_RINGS.map((ring) => (
                <OrbitRing key={ring.size} {...ring} />
              ))}

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                {[
                  [20, 14],
                  [80, 14],
                  [50, 86],
                ].map(([x, y]) => (
                  <line
                    key={`${x}-${y}`}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="#CBD2DB"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-block whitespace-nowrap rounded-full bg-deep-blue px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-deep-blue/25 xl:px-7 xl:py-3.5 xl:text-[15px]">
                  Lab Unity Network
                </span>
              </div>

              {networkNodes.map(({ role, label, avatar, className }) => (
                <div key={role} className={`absolute z-10 ${className}`}>
                  <div className="flex items-center gap-2 rounded-full border border-[#ECEEF2] bg-white py-1.5 pl-1.5 pr-3 shadow-md shadow-black/5 transition-shadow hover:shadow-lg sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-4 xl:gap-3 xl:pr-5">
                    <img
                      src={avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white sm:h-11 sm:w-11 xl:h-12 xl:w-12"
                    />
                    <div className="leading-tight">
                      <p className="text-[12px] font-semibold text-deep-blue sm:text-[13px] xl:text-[14px]">
                        {role}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#64748B] sm:text-[11px] xl:text-[12px]">
                        {label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4 border-t border-[#ECEEF2] pt-6 lg:pt-5 xl:pt-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-[18px] font-bold text-deep-blue xl:text-[20px]">{value}</p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.08em] text-[#64748B] xl:text-[11px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            {/* Marketplace */}
            <FeatureCard
              icon={Box}
              iconColor="#E67E22"
              label="Marketplace"
              heading="Laboratory Marketplace"
              text="Buy, sell, or exchange second-hand laboratory equipment and products."
              delay={0.08}
            >
              <div className="space-y-2.5">
                {marketplaceItems.map(({ title, price }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-xl bg-[#FEF7F0] p-3 transition-colors hover:bg-[#FDF0E4] xl:p-3.5"
                  >
                    <ShoppingBag
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#E67E22]"
                      strokeWidth={2.25}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-deep-blue xl:text-[15px]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#64748B] xl:text-[13px]">{price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            {/* Recruitment */}
            <FeatureCard
              icon={Briefcase}
              iconColor="#3B82F6"
              label="Recruitment"
              heading="Find The Right Talent"
              text="Discover laboratory-industry jobs and connect companies with qualified professionals."
              delay={0.16}
            >
              <div className="rounded-xl bg-secondary p-3.5 xl:p-4">
                <p className="text-[13px] font-semibold text-deep-blue xl:text-[15px]">
                  QC Laboratory Manager
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748B] xl:text-[13px]">
                  Basel · Full-time
                </p>
                <div className="my-3 border-t border-[#DDE8F2]" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#E8F3FB] xl:h-7 xl:w-7"
                      >
                        <User className="h-3 w-3 text-primary" strokeWidth={2.5} />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-[#64748B] xl:text-[12px]">
                    18 matched profiles
                  </span>
                </div>
              </div>
            </FeatureCard>

            {/* Knowledge */}
            <FeatureCard
              icon={CalendarDays}
              iconColor="#22C55E"
              label="Knowledge"
              heading="Industry Knowledge"
              text="Discover events, training, news, documentation, and useful professional resources."
              delay={0.24}
            >
              <div className="flex flex-wrap gap-2">
                {knowledgeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-green-secondary px-3 py-1.5 text-[11px] font-medium text-green-primary transition-colors hover:bg-green-secondary/80 xl:px-3.5 xl:py-2 xl:text-[12px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FeatureCard>

            {/* Messaging */}
            <FeatureCard
              icon={MessageSquare}
              iconColor="#EC4899"
              label="Messaging"
              heading="Professional Conversations"
              text="Connect one-to-one or join focused professional groups."
              delay={0.32}
            >
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <img
                    src={chatAvatars[0]}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#F3F0F8] px-3.5 py-2.5 text-[12px] text-[#64748B] shadow-sm xl:px-4 xl:py-3 xl:text-[13px]">
                    Can you share the SOP template?
                  </p>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-green-primary px-3.5 py-2.5 text-[12px] font-medium text-white shadow-sm shadow-green-primary/20 xl:px-4 xl:py-3 xl:text-[13px]">
                    Sent — see attachment
                  </p>
                  <img
                    src={chatAvatars[1]}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                </div>
                <TypingComposer />
              </div>
            </FeatureCard>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EcosystemSection;
