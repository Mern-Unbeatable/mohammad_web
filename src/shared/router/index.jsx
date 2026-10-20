import { Outlet, createBrowserRouter } from 'react-router';
import { publicRoutes } from './routes/public.routes';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { adminRoutes } from './routes/admin.routes';
import { supplierRoutes } from './routes/supplier.routes';
import RouterErrorPage from '@/modules/error/RouterErrorPage';

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