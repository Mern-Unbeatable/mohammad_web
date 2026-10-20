import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/home/pages/HomeView';
import TermsOfServiceView from '@/modules/public/legal/pages/TermsOfServiceView';
import PrivacyPolicyView from '@/modules/public/legal/pages/PrivacyPolicyView';
import { PRIVACY_PATH, TERMS_PATH } from '@/modules/public/legal';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  handle: { audience: 'public' },
  children: [
    { index: true, element: <HomeView />, handle: { title: 'Home' } },
    { path: TERMS_PATH, element: <TermsOfServiceView />, handle: { title: 'Terms of Service' } },
    { path: PRIVACY_PATH, element: <PrivacyPolicyView />, handle: { title: 'Privacy Policy' } },  ],
};
