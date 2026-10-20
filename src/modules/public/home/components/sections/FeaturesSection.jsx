import {
  User,
  Shield,
  FileText,
  MessageCircle,
  FlaskConical,
  Wrench,
  Briefcase,
  CalendarDays,
  GraduationCap,
  Newspaper,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { FadeUp, Float } from '@/shared/motion/LandingMotion';

const discoverTags = [
  { label: 'Research', icon: FlaskConical, color: 'text-pink-light', bg: 'bg-[#FDF0F6]' },
  { label: 'Equipment', icon: Wrench, color: 'text-[#E67E22]', bg: 'bg-[#FEF3E8]' },
  { label: 'Jobs', icon: Briefcase, color: 'text-primary', bg: 'bg-[#E8F3FB]' },
  { label: 'Events', icon: CalendarDays, color: 'text-green-primary', bg: 'bg-green-secondary' },
  { label: 'Training', icon: GraduationCap, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
  { label: 'Industry News', icon: Newspaper, color: 'text-primary', bg: 'bg-[#E8F3FB]' },
];

const avatars = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
];

const cardTitle =
  'text-[18px] font-bold leading-[1.3] text-deep-blue lg:text-[17px] xl:text-[20px]';
const cardBody =
  'mt-2 text-[14px] text-[#64748B] xl:mt-2.5 xl:text-base';

const FeaturesSection = () => {
  return (
    <section id="community" className="scroll-mt-[72px] bg-white py-14 lg:scroll-mt-[76px] lg:py-16 xl:scroll-mt-[84px] xl:py-24">
      <Container>
        <FadeUp className="mb-10 grid grid-cols-1 items-start gap-6 lg:mb-12 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:gap-x-10 lg:gap-y-0 xl:mb-14 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] xl:gap-x-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary xl:text-[12px]">
              Built for the laboratory industry
            </p>
            <h2 className="mt-3  text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[32px] lg:mt-4 lg:text-[34px] xl:text-[42px] xl:leading-[1.12]">
              Everything Your Professional Network Needs.
              <br />
              Nothing You Don&apos;t.
            </h2>
          </div>
          <p className="text-[15px] leading-[1.7] text-[#64748B] lg:pt-7 xl:pt-8 xl:text-[16px] xl:leading-[1.75]">
            Lab Unity is designed around the real needs of laboratory professionals
            — from finding the right contact to discovering equipment, talent,
            knowledge, and new business opportunities.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch xl:gap-6">
          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp as="article" className="flex flex-1 flex-col rounded-xl bg-pink-secondary p-6 lg:p-7 xl:p-10">
                <div className="flex items-start gap-3.5 xl:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE7F1] xl:h-11 xl:w-11">
                    <User className="h-[18px] w-[18px] text-pink-light xl:h-5 xl:w-5" strokeWidth={2.25} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={cardTitle}>Connect With The Right Professionals</h3>
                    <p className={cardBody}>
                      Build meaningful connections with researchers, lab managers,
                      suppliers, and industry experts who share your field of work.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-1 flex-col rounded-lg bg-white px-5 py-8 lg:mt-7 lg:py-7 xl:mt-8 xl:px-8 xl:py-10">
                  <div className="flex flex-1 items-end justify-center gap-5 xl:gap-6">
                    <img
                      src={avatars[0]}
                      alt=""
                      className="h-[68px] w-[68px] rounded-full object-cover ring-[3px] ring-white lg:h-[62px] lg:w-[62px] xl:h-[80px] xl:w-[80px]"
                    />
                    <Float y={5} duration={4.2} delay={0.3}>
                      <img
                        src={avatars[1]}
                        alt=""
                        className="h-[72px] w-[72px] -translate-y-2 rounded-full object-cover ring-[3px] ring-white lg:h-[66px] lg:w-[66px] lg:-translate-y-1.5 xl:h-[84px] xl:w-[84px] xl:-translate-y-2.5"
                      />
                    </Float>
                    <img
                      src={avatars[2]}
                      alt=""
                      className="h-[68px] w-[68px] rounded-full object-cover ring-[3px] ring-white lg:h-[62px] lg:w-[62px] xl:h-[80px] xl:w-[80px]"
                    />
                  </div>
                  <p className="mx-auto mt-6 rounded-full bg-[#ECEEF2] px-4 py-1.5 text-[12px] font-medium text-[#64748B] xl:mt-8 xl:px-5 xl:py-2 xl:text-[13px]">
                    14 shared fields of expertise
                  </p>
                </div>
            </FadeUp>

            <FadeUp as="article" delay={0.08} className="rounded-xl bg-secondary p-6 lg:p-7 xl:p-10">
                <h3 className={cardTitle}>Discover More Than Connections</h3>
                <div className="mt-5 flex flex-wrap gap-2 xl:mt-6 xl:gap-2.5">
                  {discoverTags.map(({ label, icon: Icon, color, bg }) => (
                    <span
                      key={label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium xl:px-4 xl:py-2.5 xl:text-[13px] ${bg} ${color}`}
                    >
                      <Icon className="h-3.5 w-3.5 xl:h-4 xl:w-4" strokeWidth={2.25} />
                      {label}
                    </span>
                  ))}
                </div>
            </FadeUp>
          </div>

          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp as="article" delay={0.12} className="rounded-xl bg-green-secondary p-6 lg:p-7 xl:p-10">
                <h3 className={cardTitle}>Collaborate With Your Community</h3>
                <p className={cardBody}>
                  Ask questions, share insights, and learn from experienced
                  professionals across the laboratory industry.
                </p>

                <div className="mt-5 rounded-lg bg-white px-4 py-4 xl:mt-6 xl:px-5 xl:py-5">
                  <p className="text-[14px] font-medium leading-snug text-deep-blue xl:text-[15px]">
                    Which HPLC column suits peptide separation?
                  </p>
                </div>
                <Float y={3} duration={3.5} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-green-primary px-4 py-2.5 xl:mt-4 xl:py-3">
                  <MessageCircle className="h-4 w-4 text-white" strokeWidth={2.25} />
                  <span className="text-[12px] font-medium text-white xl:text-[13px]">
                    6 lab specialists replied
                  </span>
                </Float>
            </FadeUp>

            <FadeUp as="article" delay={0.2} className="rounded-xl bg-secondary p-6 lg:p-7 xl:p-10">
                <h3 className={cardTitle}>Share Knowledge &amp; Resources</h3>
                <p className={cardBody}>
                  Share protocols, documents, and resources with trusted
                  professional groups and communities.
                </p>

                <div className="mt-5 flex items-center gap-3.5 rounded-lg bg-white p-4 xl:mt-6 xl:gap-4 xl:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8F3FB] xl:h-12 xl:w-12">
                    <FileText className="h-5 w-5 text-primary xl:h-[22px] xl:w-[22px]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug text-deep-blue xl:text-[15px]">
                      Validation protocol — ISO 17025.pdf
                    </p>
                    <p className="mt-1 text-[12px] text-[#64748B] xl:text-[13px]">
                      Shared with Analytical Chemistry group
                    </p>
                  </div>
                </div>
            </FadeUp>

            <FadeUp as="article" delay={0.28} className="rounded-xl bg-deep-blue p-6 lg:p-7 xl:p-10">
                <Shield className="h-5 w-5 text-[#F59E0B] xl:h-6 xl:w-6" strokeWidth={2.25} />
                <h3 className="mt-3 text-[18px] font-bold leading-[1.3] text-white lg:text-[17px] xl:mt-4 xl:text-[20px]">
                  Built For Professionals
                </h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#94A3B8] lg:text-[13px] xl:mt-2.5 xl:text-[15px] xl:leading-[1.7]">
                  A focused environment designed specifically for the laboratory
                  industry.
                </p>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;
