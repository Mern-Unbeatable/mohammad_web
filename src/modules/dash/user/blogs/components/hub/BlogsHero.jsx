import { ArrowRight, Sparkles } from 'lucide-react';
import { SearchInput } from '@/components/form-controls';
import Container from '@/components/ui/Container';
import { LATEST_HUB_SECTION_ID } from '../../constant/constants';

const scrollToLatest = () =>
  document.getElementById(LATEST_HUB_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });

const BlogsHero = ({ query, onQueryChange }) => (
  <section className="border-b border-[#E4E7EC] bg-gradient-to-b from-secondary to-white py-8 sm:py-12 lg:py-14">
    <Container className="text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B] sm:text-[11px]">
        <Sparkles className="h-3.5 w-3.5 text-[#E67E22]" />
        Lab Unity Knowledge Hub
      </span>

      <h1 className="mx-auto mt-4 max-w-3xl text-[24px] font-bold leading-tight text-deep-blue sm:mt-5 sm:text-[34px] lg:text-[40px] lg:leading-[1.15]">
        Insights, Knowledge &amp; Opportunities
        <br className="hidden sm:block" />
        <span className="sm:ml-0"> </span>
        <span className="text-green-primary">for the Laboratory Industry.</span>
      </h1>

      <p className="mx-auto mt-3 max-w-2xl px-1 text-[13px] leading-relaxed text-[#64748B] sm:mt-4 sm:text-[15px]">
        Explore expert articles, research summaries, training resources and industry news
        curated for QC, microbiology and validation professionals.
      </p>

      <div className="mx-auto mt-5 max-w-xl sm:mt-6">
        <SearchInput
          variant="hero"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search articles, topics, research..."
        />
      </div>

      <button
        type="button"
        onClick={scrollToLatest}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#066BB0] sm:mt-5 sm:px-5 sm:text-[13px]"
      >
        Explore Articles
        <ArrowRight className="h-4 w-4" />
      </button>
    </Container>
  </section>
);

export default BlogsHero;
