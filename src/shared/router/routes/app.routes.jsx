import AppRootLayout from '@/layouts/AppRootLayout';
import RouterErrorPage from '@/modules/error/RouterErrorPage';
import { publicRoutes } from './public.routes';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { supplierRoutes } from './supplier.routes';
import { notFoundRoute } from './notFound.routes';

/** The full route tree; kept apart from `createBrowserRouter` so tests can match against it. */
export const appRoutes = [
  {
    element: <AppRootLayout />,
    errorElement: <RouterErrorPage />,
    children: [
      publicRoutes,
      ...authRoutes,
      userRoutes,
      adminRoutes,
      supplierRoutes,
      notFoundRoute,
    ],
  },
];
