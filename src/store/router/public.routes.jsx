import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/pages/home/HomeView';
import DeveloperPage from '@/modules/public/pages/developer/DeveloperPage';
import TermsOfServiceView from '@/modules/public/pages/legal/TermsOfServiceView';
import PrivacyPolicyView from '@/modules/public/pages/legal/PrivacyPolicyView';
import NotFound from '@/shared/pages/NotFound';
import { PRIVACY_PATH, TERMS_PATH } from '@/shared/constants/legal';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  handle: { audience: 'public' },
  children: [
    { index: true, element: <HomeView />, handle: { title: 'Home' } },
    { path: 'developer', element: <DeveloperPage />, handle: { title: 'Developer' } },
    {
      path: 'developer/:componentId',
      element: <DeveloperPage />,
      handle: { title: 'Developer' },
    },
    { path: TERMS_PATH, element: <TermsOfServiceView />, handle: { title: 'Terms of Service' } },
    { path: PRIVACY_PATH, element: <PrivacyPolicyView />, handle: { title: 'Privacy Policy' } },
    { path: '*', element: <NotFound />, handle: { title: 'Not found' } },
  ],
};
