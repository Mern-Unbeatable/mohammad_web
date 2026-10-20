import {
  Box,
  Briefcase,
  CalendarDays,
  MessageSquare,
  ShoppingBag,
  User,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { FadeUp, Float, Pulse, RingPulse } from '@/shared/motion/LandingMotion';

const networkNodes = [
  {
    role: 'Researcher',
    label: 'Biochemistry',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    className: 'left-[8%] top-[8%]',
  },
  {
    role: 'Laboratory',
    label: 'Nordic Analytics',
    avatar:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=80&fit=crop&crop=face',
    className: 'right-[8%] top-[8%]',
  },
  {
    role: 'Supplier',
    label: 'Chromatography',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
    className: 'bottom-[6%] left-1/2 -translate-x-1/2',
  },
];

const stats = [
  { value: '2,500+', label: 'LABORATORIES' },
  { value: '12K+', label: 'PROFESSIONALS' },
  { value: '120+', label: 'COUNTRIES' },
];

const marketplaceItems = [
  {
    title: 'Agilent 1260 HPLC System',
    price: 'Refurbished · €14,500',
  },
  {
    title: 'Benchtop Centrifuge 5810R',
    price: 'Used · €3,200',
  },
];

const knowledgeTags = ['Analytica 2026 · Munich', 'GMP Training · Online'];

const cardLabel =
  'text-[10px] font-semibold uppercase tracking-[0.12em] xl:text-[11px]';
const cardHeading =
  'mt-2 text-base font-bold leading-snug text-deep-blue xl:text-[18px]';
const cardText =
  'mt-1 text-sm text-[#64748B] xl:text-base';

const ringClass =
  'absolute left-1/2 top-1/2 rounded-full border border-[#ECEEF2]';

const EcosystemSection = () => {
  return (
    <section id="marketplace" className="scroll-mt-[72px] bg-[#F7F8FA] py-14 lg:scroll-mt-[76px] lg:py-16 xl:scroll-mt-[84px] xl:py-24">
      <Container>
        <FadeUp className="mb-10 lg:mb-12 xl:mb-14">
          <p className={`${cardLabel} text-pink-light`}>One professional ecosystem</p>
          <h2 className="mt-3 max-w-[720px] text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-deep-blue sm:text-[32px] lg:text-[34px] xl:text-[42px]">
            From Research To Opportunity, All In One Place.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch xl:gap-6">
          <article className="flex h-full flex-col rounded-xl border border-[#E8ECF0] bg-white p-6 lg:p-7 xl:p-8">
            <p className={`${cardLabel} text-primary`}>Core</p>
            <h3 className={cardHeading}>Professional Network</h3>
            <p className={cardText}>
              Researchers, laboratories and suppliers linked in one verified
              professional graph.
            </p>

            <div className="relative mx-auto mt-6 h-[280px] w-full max-w-[420px] lg:mt-7 lg:h-[260px] xl:mt-8 xl:h-[300px]">
              <RingPulse className={`${ringClass} h-[220px] w-[220px]`} duration={5} />
              <RingPulse className={`${ringClass} h-[170px] w-[170px]`} duration={6.5} delay={0.4} />
              <RingPulse className={`${ringClass} h-[120px] w-[120px]`} duration={4} delay={0.8} />

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 420 280"
                fill="none"
                aria-hidden="true"
              >
                <line x1="210" y1="140" x2="70" y2="55" stroke="#D1D5DB" strokeWidth="1" />
                <line x1="210" y1="140" x2="350" y2="55" stroke="#D1D5DB" strokeWidth="1" />
                <line x1="210" y1="140" x2="210" y2="230" stroke="#D1D5DB" strokeWidth="1" />
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <Pulse duration={2.8}>
                  <span className="inline-block rounded-full bg-deep-blue px-5 py-2.5 text-[12px] font-semibold text-white xl:px-6 xl:py-3 xl:text-[13px]">
                    Lab Unity Network
                  </span>
                </Pulse>
              </div>

              {networkNodes.map(({ role, label, avatar, className }, index) => (
                <div key={role} className={`absolute z-10 ${className}`}>
                  <Float y={6} duration={4.5} delay={index * 0.7}>
                    <div className="flex items-center gap-2 rounded-full border border-[#ECEEF2] bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                      <img
                        src={avatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover xl:h-9 xl:w-9"
                      />
                      <div className="leading-tight">
                        <p className="text-[11px] font-semibold text-deep-blue xl:text-[12px]">
                          {role}
                        </p>
                        <p className="text-[10px] text-[#64748B] xl:text-[11px]">{label}</p>
                      </div>
                    </div>
                  </Float>
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4 border-t border-[#ECEEF2] pt-6 lg:pt-5 xl:pt-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-[18px] font-bold text-deep-blue xl:text-[20px]">
                    {value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.08em] text-[#64748B] xl:text-[11px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            <FadeUp as="article" delay={0.08} className="rounded-xl border border-[#E8ECF0] bg-white p-6 lg:p-5 xl:p-7">
                <div className="flex items-center gap-1.5">
                  <Box className="h-3.5 w-3.5 text-[#E67E22]" strokeWidth={2.5} />
                  <p className={`${cardLabel} text-[#E67E22]`}>Marketplace</p>
                </div>
                <h3 className={cardHeading}>Laboratory Marketplace</h3>
                <p className={cardText}>
                  Buy, sell, or exchange second-hand laboratory equipment and
                  products.
                </p>
                <div className="mt-4 space-y-2.5 xl:mt-5">
                  {marketplaceItems.map(({ title, price }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 rounded-lg bg-[#FEF7F0] p-3 xl:p-3.5"
                    >
                      <ShoppingBag
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#E67E22]"
                        strokeWidth={2.25}
                      />
                      <div>
                        <p className="text-[14px] font-semibold text-deep-blue xl:text-[15px]">
                          {title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#64748B] xl:text-[13px]">
                          {price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
            </FadeUp>

            <FadeUp as="article" delay={0.16} className="rounded-xl border border-[#E8ECF0] bg-white p-6 lg:p-5 xl:p-7">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                  <p className={`${cardLabel} text-primary`}>Recruitment</p>
                </div>
                <h3 className={cardHeading}>Find The Right Talent</h3>
                <p className={cardText}>
                  Discover laboratory-industry jobs and connect companies with
                  qualified professionals.
                </p>
                <div className="mt-4 rounded-lg bg-secondary p-3.5 xl:mt-5 xl:p-4">
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
            </FadeUp>

            <FadeUp as="article" delay={0.24} className="rounded-xl border border-[#E8ECF0] bg-white p-6 lg:p-5 xl:p-7">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-green-primary" strokeWidth={2.5} />
                  <p className={`${cardLabel} text-green-primary`}>Knowledge</p>
                </div>
                <h3 className={cardHeading}>Industry Knowledge</h3>
                <p className={cardText}>
                  Discover events, training, news, documentation, and useful
                  professional resources.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 xl:mt-5">
                  {knowledgeTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-green-secondary px-3 py-1.5 text-[11px] font-medium text-green-primary xl:px-3.5 xl:py-2 xl:text-[12px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
            </FadeUp>

            <FadeUp as="article" delay={0.32} className="rounded-xl border border-[#E8ECF0] bg-white p-6 lg:p-5 xl:p-7">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-pink-light" strokeWidth={2.5} />
                  <p className={`${cardLabel} text-pink-light`}>Messaging</p>
                </div>
                <h3 className={cardHeading}>Professional Conversations</h3>
                <p className={cardText}>
                  Connect one-to-one or join focused professional groups.
                </p>
                <div className="mt-4 space-y-3 xl:mt-5">
                  <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[#F3F0F8] px-3.5 py-2.5 xl:px-4 xl:py-3">
                    <p className="text-[12px] text-[#64748B] xl:text-[13px]">
                      Can you share the SOP template?
                    </p>
                  </div>
                  <Float y={4} duration={4} delay={0.5} className="flex justify-end">
                    <span className="rounded-full bg-green-primary px-4 py-2 text-[11px] font-medium text-white xl:px-5 xl:py-2.5 xl:text-[12px]">
                      Sent — see attachment
                    </span>
                  </Float>
                </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EcosystemSection;
