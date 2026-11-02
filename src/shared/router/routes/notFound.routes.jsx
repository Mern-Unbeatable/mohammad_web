import NotFoundLayout from '@/layouts/NotFoundLayout';

/** Lowest-ranked match: only URLs no other route group claims reach it. */
export const notFoundRoute = {
  path: '*',
  element: <NotFoundLayout />,
  handle: { title: 'Not found' },
};
