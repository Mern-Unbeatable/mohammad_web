import { Box, Briefcase, CalendarDays, MessageSquare, ShoppingBag, User } from 'lucide-react';
import Container from '@/components/ui/Container';
import { FadeUp, Float } from '@/shared/motion/LandingMotion';
import {
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

const ringClass =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ECEEF2]';

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

            <div className="relative mx-auto mt-6 h-[280px] w-full max-w-[420px] lg:mt-7 lg:h-[260px] xl:mt-8 xl:h-[300px]">
              <div className={`${ringClass} h-[220px] w-[220px]`} />
              <div className={`${ringClass} h-[170px] w-[170px]`} />
              <div className={`${ringClass} h-[120px] w-[120px]`} />

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 420 280"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="210"
                  y1="140"
                  x2="70"
                  y2="55"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1="210"
                  y1="140"
                  x2="350"
                  y2="55"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1="210"
                  y1="140"
                  x2="210"
                  y2="230"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-block rounded-full bg-deep-blue px-5 py-2.5 text-[12px] font-semibold text-white shadow-md shadow-deep-blue/20 xl:px-6 xl:py-3 xl:text-[13px]">
                  Lab Unity Network
                </span>
              </div>

              {networkNodes.map(({ role, label, avatar, className }) => (
                <div key={role} className={`absolute z-10 ${className}`}>
                  <div className="flex items-center gap-2 rounded-full border border-[#ECEEF2] bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-shadow hover:shadow-md">
                    <img
                      src={avatar}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5 xl:h-9 xl:w-9"
                    />
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold text-deep-blue xl:text-[12px]">
                        {role}
                      </p>
                      <p className="text-[10px] text-[#64748B] xl:text-[11px]">{label}</p>
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
                <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[#F3F0F8] px-3.5 py-2.5 shadow-sm xl:px-4 xl:py-3">
                  <p className="text-[12px] text-[#64748B] xl:text-[13px]">
                    Can you share the SOP template?
                  </p>
                </div>
                <Float y={4} duration={4} delay={0.5} className="flex justify-end">
                  <span className="rounded-full bg-green-primary px-4 py-2 text-[11px] font-medium text-white shadow-sm shadow-green-primary/20 xl:px-5 xl:py-2.5 xl:text-[12px]">
                    Sent — see attachment
                  </span>
                </Float>
              </div>
            </FeatureCard>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EcosystemSection;
