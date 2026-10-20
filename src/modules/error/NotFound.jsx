import { Link } from 'react-router';

const NotFound = () => {
  return (
    <section className="flex min-h-[calc(100vh-72px-80px)] items-center justify-center bg-[#F7F8FA] px-6 py-16 lg:min-h-[calc(100vh-76px-80px)] xl:min-h-[calc(100vh-84px-80px)]">
      <div className="text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">
          404 error
        </p>
        <h1 className="mt-3 text-[72px] font-bold leading-none tracking-[-0.04em] text-deep-blue sm:text-[96px]">
          404
        </h1>
        <h2 className="mt-4 text-[24px] font-bold text-deep-blue sm:text-[28px]">
          Page not found
        </h2>
        <p className="mx-auto mt-3 max-w-[420px] text-base leading-[1.65] text-[#64748B]">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
