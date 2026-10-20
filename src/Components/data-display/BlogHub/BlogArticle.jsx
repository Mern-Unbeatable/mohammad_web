import { Link } from 'react-router';

const BlogArticle = ({ detail, basePath }) => (
  <article className="min-w-0">
    <Link
      to={basePath}
      className="mb-4 inline-flex text-[13px] font-medium text-primary hover:underline sm:mb-5"
    >
      ← Back to Blogs
    </Link>

    <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[28px] lg:text-[32px]">
      {detail.title}
    </h1>

    <p className="mt-3 flex flex-col gap-1 text-[12px] text-[#64748B] sm:flex-row sm:flex-wrap sm:gap-x-2 sm:text-[13px]">
      <span>By {detail.authorDisplay}</span>
      <span className="hidden sm:inline">|</span>
      <span>Published on {detail.publishedOn}</span>
      <span className="hidden sm:inline">|</span>
      <span>{detail.readTime}</span>
    </p>

    <img
      src={detail.image}
      alt=""
      className="mt-5 aspect-[16/9] w-full rounded-lg object-cover sm:mt-6 sm:rounded-xl"
    />

    <div className="mt-6 space-y-4 sm:mt-8">
      {detail.body.map((paragraph) => (
        <p key={paragraph} className="text-[14px] leading-[1.75] text-[#475467] sm:text-[15px]">
          {paragraph}
        </p>
      ))}
    </div>
  </article>
);

export default BlogArticle;
