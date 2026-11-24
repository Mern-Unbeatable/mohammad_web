import { Calendar, MapPin } from 'lucide-react';
import { POST_TYPE, POST_TYPE_STYLES } from '../../constant/constants';

/** Cover image, type badge, title, date and category. */
const GeneralPostHeader = ({ post }) => (
  <>
    <img
      src={post.image}
      alt=""
      className="aspect-[21/9] w-full rounded-2xl object-cover sm:aspect-[16/7]"
    />

    <span
      className={`mt-5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] lg:text-[12px] ${
        POST_TYPE_STYLES[post.type] || POST_TYPE_STYLES[POST_TYPE.NEWS]
      }`}
    >
      {post.type === POST_TYPE.DOCUMENT ? 'Document' : 'News'}
    </span>

    <h1 className="mt-3 text-[24px] font-bold leading-tight text-deep-blue sm:text-[28px] lg:text-[32px]">
      {post.title}
    </h1>

    <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-[#98A2B3] sm:text-[13px] lg:text-[14px]">
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {post.displayDate}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {post.category}
      </span>
    </div>
  </>
);

export default GeneralPostHeader;
