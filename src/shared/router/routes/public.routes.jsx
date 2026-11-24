import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/home/pages/HomeView';
import TermsOfServiceView from '@/modules/public/legal/pages/TermsOfServiceView';
import PrivacyPolicyView from '@/modules/public/legal/pages/PrivacyPolicyView';
import { PRIVACY_PATH, TERMS_PATH } from '@/modules/public/legal';
import PricingView from '@/modules/public/pricing/pages/PricingView';
import { PRICING_PATH } from '@/modules/public/pricing';
import ContactView from '@/modules/public/contact/pages/ContactView';
import { CONTACT_PATH } from '@/modules/public/contact';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  handle: { audience: 'public' },
  children: [
    { index: true, element: <HomeView />, handle: { title: 'Home' } },
    { path: TERMS_PATH, element: <TermsOfServiceView />, handle: { title: 'Terms of Service' } },
    { path: PRIVACY_PATH, element: <PrivacyPolicyView />, handle: { title: 'Privacy Policy' } },
    { path: PRICING_PATH, element: <PricingView />, handle: { title: 'Pricing' } },
    { path: CONTACT_PATH, element: <ContactView />, handle: { title: 'Contact Us' } },
  ],
};
