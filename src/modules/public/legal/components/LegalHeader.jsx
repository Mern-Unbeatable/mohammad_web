import { LEGAL_LAST_UPDATED } from '../constant/constants';

const LegalHeader = ({ title, intro }) => (
  <header className="mb-8 lg:mb-10">
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary xl:text-[12px]">
      Legal
    </p>
    <h1 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[36px] xl:text-[42px]">
      {title}
    </h1>
    <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#64748B] xl:text-[16px]">
      {intro}
    </p>
    <p className="mt-4 text-[13px] text-[#64748B]">
      Last updated: {LEGAL_LAST_UPDATED}
    </p>
  </header>
);

export default LegalHeader;
