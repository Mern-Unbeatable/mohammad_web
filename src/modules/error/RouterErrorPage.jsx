import { Link, useRouteError, isRouteErrorResponse } from 'react-router';

const RouterErrorPage = () => {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred while loading this page.';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-6 py-16">
      <div className="text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">Error</p>
        <h1 className="mt-3 text-[28px] font-bold text-deep-blue sm:text-[32px]">{title}</h1>
        <p className="mx-auto mt-3 max-w-[420px] text-base leading-[1.65] text-[#64748B]">{message}</p>
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

export default RouterErrorPage;
