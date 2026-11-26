import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/home/pages/HomeView';
import TermsOfServiceView from '@/modules/public/legal/pages/TermsOfServiceView';
import PrivacyPolicyView from '@/modules/public/legal/pages/PrivacyPolicyView';
import { PRIVACY_PATH, TERMS_PATH } from '@/modules/public/legal';
import PricingView from '@/modules/public/pricing/pages/PricingView';
import { PRICING_PATH } from '@/modules/public/pricing';
import ContactView from '@/modules/public/contact/pages/ContactView';
import { CONTACT_PATH } from '@/modules/public/contact';
import AboutView from '@/modules/public/about/pages/AboutView';
import { ABOUT_PATH } from '@/modules/public/about';
import PublicGeneralView from '@/modules/public/general/pages/PublicGeneralView';
import PublicGeneralPostDetailView from '@/modules/public/general/pages/PublicGeneralPostDetailView';
import { PUBLIC_GENERAL_PATH } from '@/modules/public/general';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  handle: { audience: 'public' },
  children: [
    { index: true, element: <HomeView />, handle: { title: 'Home' } },
    { path: TERMS_PATH, element: <TermsOfServiceView />, handle: { title: 'Terms of Use and Sale' } },
    { path: PRIVACY_PATH, element: <PrivacyPolicyView />, handle: { title: 'Privacy Policy' } },
    { path: PRICING_PATH, element: <PricingView />, handle: { title: 'Pricing' } },
    { path: ABOUT_PATH, element: <AboutView />, handle: { title: 'About' } },
    { path: CONTACT_PATH, element: <ContactView />, handle: { title: 'Contact Us' } },
    {
      path: PUBLIC_GENERAL_PATH,
      element: <PublicGeneralView />,
      handle: { title: 'General' },
    },
    {
      path: `${PUBLIC_GENERAL_PATH}/:postId`,
      element: <PublicGeneralPostDetailView />,
      handle: { title: 'General Post' },
    },
  ],
};
