import {
  BookOpen,
  Compass,
  FileText,
  MessageCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { FadeUp } from "@/shared/motion/LandingMotion";
import ConnectNetwork from "../ConnectNetwork";
import DiscoverTag from "../DiscoverTag";
import {
  CONNECT_AVATARS as avatars,
  DISCOVER_TAGS,
  HOME_SECTIONS,
} from "../../constant/constants";

const cardTitle =
  "text-[18px] font-bold leading-[1.3] text-deep-blue lg:text-[17px] xl:text-[20px]";
const cardBody =
  "mt-2 text-[14px] leading-[1.65] text-[#64748B] xl:mt-2.5 xl:text-base xl:leading-[1.7]";

const cardBase =
  "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 lg:p-7 xl:p-9";

const CardIcon = ({ icon, color, ring }) => {
  const Icon = icon;
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ${ring} xl:h-12 xl:w-12`}
    >
      <Icon
        className={`h-[18px] w-[18px] xl:h-5 xl:w-5 ${color}`}
        strokeWidth={2.25}
      />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section
      id={HOME_SECTIONS.COMMUNITY}
      className="scroll-mt-[72px] bg-gradient-to-b from-white via-slate-50/40 to-white py-14 lg:scroll-mt-[76px] lg:py-16 xl:scroll-mt-[84px] xl:py-24"
    >
      <Container>
        {/* Header */}
        <FadeUp className="mb-10 grid grid-cols-1 items-start gap-6 lg:mb-12 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:gap-x-10 lg:gap-y-0 xl:mb-14 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] xl:gap-x-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary xl:text-[12px]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for the laboratory industry
            </p>
            <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[32px] lg:mt-5 lg:text-[34px] xl:text-[42px] xl:leading-[1.12]">
              Everything Your Professional Network Needs.
              <br />
              <span className="text-primary/80">Nothing You Don&apos;t.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-[1.7] text-[#64748B] lg:pt-7 xl:pt-8 xl:text-[16px] xl:leading-[1.75]">
            Lab Unity is designed around the real needs of laboratory
            professionals — from finding the right contact to discovering
            equipment, talent, knowledge, and new business opportunities.
          </p>
        </FadeUp>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch xl:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-5 xl:gap-6">
            {/* Connect Card */}
            <FadeUp
              as="article"
              className={`${cardBase} flex flex-1 flex-col bg-gradient-to-br from-pink-secondary to-pink-secondary/70 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-3.5 xl:gap-4">
                <CardIcon
                  icon={User}
                  color="text-pink-light"
                  ring="ring-pink-light/10"
                />
                <div className="min-w-0">
                  <h3 className={cardTitle}>
                    Connect With The Right Professionals
                  </h3>
                  <p className={cardBody}>
                    Build meaningful connections with researchers, lab managers,
                    suppliers, and industry experts who share your field of
                    work.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-1 flex-col rounded-xl bg-white/90 px-5 py-8 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm lg:mt-7 lg:py-7 xl:mt-8 xl:px-8 xl:py-10">
                <div className="flex flex-1 items-center justify-center">
                  <ConnectNetwork avatars={avatars} />
                </div>
                <p className="mx-auto mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#ECEEF2] px-4 py-1.5 text-[12px] font-medium text-[#64748B] xl:mt-8 xl:px-5 xl:py-2 xl:text-[13px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-light" />
                  14 shared fields of expertise
                </p>
              </div>

              <div className="mt-5 xl:mt-6">
                <div className="flex items-center gap-3.5 xl:gap-4">
                  <CardIcon
                    icon={Compass}
                    color="text-pink-light"
                    ring="ring-pink-light/10"
                  />
                  <h3 className={cardTitle}>Discover More Than Connections</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 xl:mt-5 xl:gap-2.5">
                  {DISCOVER_TAGS.map((tag) => (
                    <DiscoverTag key={tag.label} {...tag} />
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 xl:gap-6">
            {/* Collaborate Card */}
            <FadeUp
              as="article"
              delay={0.12}
              className={`${cardBase} bg-gradient-to-br from-green-secondary to-green-secondary/70 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-3.5 xl:gap-4">
                <CardIcon
                  icon={Users}
                  color="text-green-primary"
                  ring="ring-green-primary/10"
                />
                <div className="min-w-0">
                  <h3 className={cardTitle}>Collaborate With Your Community</h3>
                  <p className={cardBody}>
                    Ask questions, share insights, and learn from experienced
                    professionals across the laboratory industry.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-white/90 px-4 py-4 shadow-sm ring-1 ring-black/[0.03] xl:mt-6 xl:px-5 xl:py-5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-primary/10 text-[10px] font-bold text-green-primary">
                    Q
                  </span>
                  <p className="text-[14px] font-medium leading-snug text-deep-blue xl:text-[15px]">
                    Which HPLC column suits peptide separation?
                  </p>
                </div>
              </div>
              <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-green-primary px-4 py-2.5 shadow-sm shadow-green-primary/20 xl:mt-4 xl:py-3">
                <MessageCircle
                  className="h-4 w-4 text-white"
                  strokeWidth={2.25}
                />
                <span className="text-[12px] font-medium text-white xl:text-[13px]">
                  6 lab specialists replied
                </span>
              </div>
            </FadeUp>

            {/* Share Knowledge Card */}
            <FadeUp
              as="article"
              delay={0.2}
              className={`${cardBase} bg-gradient-to-br from-secondary to-secondary/60 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-3.5 xl:gap-4">
                <CardIcon
                  icon={BookOpen}
                  color="text-primary"
                  ring="ring-primary/10"
                />
                <div className="min-w-0">
                  <h3 className={cardTitle}>Share Knowledge &amp; Resources</h3>
                  <p className={cardBody}>
                    Share protocols, documents, and resources with trusted
                    professional groups and communities.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3.5 rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] transition-colors hover:bg-white xl:mt-6 xl:gap-4 xl:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8F3FB] xl:h-12 xl:w-12">
                  <FileText
                    className="h-5 w-5 text-primary xl:h-[22px] xl:w-[22px]"
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold leading-snug text-deep-blue xl:text-[15px]">
                    Validation protocol — ISO 17025.pdf
                  </p>
                  <p className="mt-1 text-[12px] text-[#64748B] xl:text-[13px]">
                    Shared with Analytical Chemistry group
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Built For Professionals Card */}
            <FadeUp
              as="article"
              delay={0.28}
              className={`${cardBase} bg-gradient-to-br from-deep-blue to-deep-blue/90 shadow-sm hover:shadow-lg`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                  <Shield
                    className="h-5 w-5 text-[#F59E0B] xl:h-6 xl:w-6"
                    strokeWidth={2.25}
                  />
                </div>
                <span className="rounded-full bg-[#F59E0B]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F59E0B]">
                  Verified
                </span>
              </div>
              <h3 className="mt-4 text-[18px] font-bold leading-[1.3] text-white lg:text-[17px] xl:mt-5 xl:text-[20px]">
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
