import { Link } from 'react-router';
import LegalDocument from './LegalDocument';
import { PRIVACY_PATH } from '@/modules/public/pages/legal/constant/constants';
import { CONTACT_SUPPORT_PATH, SUPPORT_CONTACT } from '@/shared/constants/support';

const sections = [
  {
    id: 'acceptance',
    heading: 'Acceptance of these terms',
    content: (
      <>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Lab Unity,
          including our website, web application, professional directory, community features,
          messaging, marketplace and recruitment tools (together, the &quot;Platform&quot;).
        </p>
        <p>
          By creating an account, or by otherwise accessing or using the Platform, you agree to be
          bound by these Terms and by our <Link to={PRIVACY_PATH}>Privacy Policy</Link>. If you do
          not agree, you must not register for or use the Platform.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    heading: 'Who can use Lab Unity',
    content: (
      <>
        <p>
          Lab Unity is a professional network for the laboratory industry. To use the Platform you
          must:
        </p>
        <ul>
          <li>be at least 18 years old and able to enter into a binding agreement;</li>
          <li>
            use the Platform for professional purposes related to laboratories, healthcare,
            research, or the supply of laboratory equipment, products and services;
          </li>
          <li>
            have the authority to act on behalf of any company, laboratory, hospital or other
            organization you represent on the Platform.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'accounts',
    heading: 'Your account',
    content: (
      <>
        <p>
          You must provide accurate, current and complete information when you register and keep
          it up to date. Each account is personal and may not be shared, sold or transferred.
        </p>
        <p>
          You are responsible for keeping your password confidential and for all activity that
          happens under your account. If you suspect unauthorized access, change your password
          immediately and contact us at{' '}
          <a href={`mailto:${SUPPORT_CONTACT.email}`}>{SUPPORT_CONTACT.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'directory',
    heading: 'Professional directory and profile visibility',
    content: (
      <>
        <p>
          Lab Unity is built around connecting professionals. When you register, you agree that
          your professional profile may be listed in the Lab Unity professional contacts
          directory and shown to other signed-in members.
        </p>
        <p>
          Directory listings can include your name, job title, company or laboratory, country,
          profile type, profile photo and the professional information you choose to add. Details
          about what we share and how to control it are described in our{' '}
          <Link to={PRIVACY_PATH}>Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    content: (
      <>
        <p>When using the Platform you agree not to:</p>
        <ul>
          <li>impersonate any person or organization, or misrepresent your affiliation;</li>
          <li>
            post content that is unlawful, misleading, defamatory, harassing, discriminatory,
            obscene or that infringes the rights of others;
          </li>
          <li>
            share confidential patient data, personal health information or other people&apos;s
            personal data without a lawful basis to do so;
          </li>
          <li>send spam, unsolicited bulk messages or unauthorized advertising;</li>
          <li>
            scrape, harvest or export directory data or member contact details by automated means;
          </li>
          <li>
            upload malware, attempt to gain unauthorized access, or interfere with the security or
            operation of the Platform;
          </li>
          <li>use the Platform for any purpose that breaches applicable laws or regulations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'content',
    heading: 'Content you share',
    content: (
      <>
        <p>
          You keep ownership of the posts, comments, documents, files, messages, listings and other
          content you submit to the Platform (&quot;Your Content&quot;). You are solely responsible
          for Your Content and must have all rights needed to share it.
        </p>
        <p>
          You grant Lab Unity a worldwide, non-exclusive, royalty-free licence to host, store,
          reproduce, display and distribute Your Content only as needed to operate, provide and
          improve the Platform, and in line with the audience you choose (for example, a group, a
          conversation or the community feed). This licence ends when Your Content is deleted from
          the Platform, except where it has been shared with others who have not deleted it or
          where we must keep it for legal reasons.
        </p>
      </>
    ),
  },
  {
    id: 'marketplace',
    heading: 'Marketplace, suppliers and recruitment',
    content: (
      <>
        <p>
          The Platform allows suppliers to present equipment, products and services, and allows
          organizations to publish job and recruitment opportunities. Lab Unity is not a party to
          any agreement, purchase, sale or employment relationship between members.
        </p>
        <p>
          Members who publish listings are responsible for their accuracy, legality, pricing and
          fulfilment. We do not guarantee the quality, safety or availability of any listed item,
          service or opportunity, and you should carry out your own checks before entering into
          any transaction.
        </p>
      </>
    ),
  },
  {
    id: 'subscriptions',
    heading: 'Trial period, subscriptions and payments',
    content: (
      <>
        <p>
          Registration is free during the initial trial period and no payment details are required
          to create an account. Some features may later be offered as paid subscription plans.
        </p>
        <p>
          If you choose a paid plan, the price, billing interval and included features will be
          shown before you subscribe. Payments are processed by our payment provider, Stripe;
          Lab Unity does not store your full card details. Subscriptions renew automatically at
          the end of each billing period until cancelled, and you can cancel at any time with
          effect from the end of the current period, unless applicable law gives you additional
          rights.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    content: (
      <p>
        The Platform, including its software, design, logos, trademarks and content we provide
        (excluding Your Content and content from other members), is owned by Lab Unity or its
        licensors and is protected by intellectual property laws. You may not copy, modify,
        distribute or reverse engineer any part of the Platform except as permitted by law or
        with our written permission.
      </p>
    ),
  },
  {
    id: 'suspension',
    heading: 'Moderation, suspension and termination',
    content: (
      <>
        <p>
          We may review, remove or restrict access to content, and may suspend or terminate
          accounts, if we reasonably believe that these Terms or applicable laws have been broken,
          or to protect members, third parties or the Platform.
        </p>
        <p>
          If your account has been suspended and you believe this was a mistake, you can{' '}
          <Link to={CONTACT_SUPPORT_PATH}>contact support</Link> to request a review. You may
          close your account at any time by contacting us.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers',
    content: (
      <p>
        The Platform is provided &quot;as is&quot; and &quot;as available&quot;. Information shared
        by members, including scientific, technical, medical or regulatory content, is not
        professional advice and is not verified by Lab Unity. To the extent permitted by law, we
        disclaim all warranties, express or implied, including warranties of merchantability,
        fitness for a particular purpose and non-infringement, and we do not guarantee that the
        Platform will be uninterrupted, secure or error-free.
      </p>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    content: (
      <p>
        To the extent permitted by law, Lab Unity will not be liable for any indirect, incidental,
        special, consequential or punitive damages, or for loss of profits, revenue, data or
        goodwill, arising from your use of or inability to use the Platform, or from any content,
        listing or conduct of other members. Nothing in these Terms limits liability that cannot
        be limited under applicable law.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    content: (
      <p>
        We may update these Terms from time to time. When we make material changes we will update
        the &quot;Last updated&quot; date above and, where appropriate, notify you by email or
        through the Platform. Continuing to use the Platform after changes take effect means you
        accept the updated Terms.
      </p>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    content: (
      <p>
        These Terms are governed by the laws of the country in which Lab Unity&apos;s operating
        entity is established, without prejudice to any mandatory consumer protection rights you
        have under the laws of your country of residence.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact us',
    content: (
      <p>
        If you have any questions about these Terms, please email us at{' '}
        <a href={`mailto:${SUPPORT_CONTACT.email}`}>{SUPPORT_CONTACT.email}</a> or visit our{' '}
        <Link to={CONTACT_SUPPORT_PATH}>support page</Link>.
      </p>
    ),
  },
];

const TermsOfServiceView = () => (
  <LegalDocument
    title="Terms of Service"
    intro="These terms explain the rules for using Lab Unity, the professional network for the laboratory industry. Please read them carefully before creating your account."
    sections={sections}
    related={{ to: PRIVACY_PATH, label: 'Privacy Policy' }}
  />
);

export default TermsOfServiceView;
