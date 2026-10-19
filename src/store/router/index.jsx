import { Outlet, createBrowserRouter } from 'react-router';
import { publicRoutes } from './public.routes';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { supplierRoutes } from './supplier.routes';
import RouterErrorPage from '@/shared/routing/RouterErrorPage';

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouterErrorPage />,
    children: [
      publicRoutes,
      ...authRoutes,
      userRoutes,
      adminRoutes,
      supplierRoutes,
    ],
  },
]);