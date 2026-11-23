import { Link } from 'react-router';
import LegalDocument from './LegalDocument';
import { TERMS_PATH } from '@/shared/constants/legal';
import { SUPPORT_CONTACT } from '@/shared/constants/support';

const sections = [
  {
    id: 'introduction',
    heading: 'Who we are',
    content: (
      <>
        <p>
          This Privacy Policy explains how Lab Unity (&quot;we&quot;, &quot;us&quot;) collects,
          uses, shares and protects personal data when you visit our website or use the Lab Unity
          platform (the &quot;Platform&quot;). Lab Unity is the controller of the personal data
          described in this policy.
        </p>
        <p>
          This policy should be read together with our{' '}
          <Link to={TERMS_PATH}>Terms of Service</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    heading: 'Information we collect',
    content: (
      <>
        <p>
          <strong>Information you give us when you register:</strong> first and last name, email
          address, phone number, password (stored only in hashed form), profile type, job title or
          position, company or laboratory name, country and any professional information you
          choose to add.
        </p>
        <p>
          <strong>Profile and content:</strong> profile photos, posts, comments, documents and files
          you upload, marketplace listings, recruitment posts, group activity and messages you send
          to other members.
        </p>
        <p>
          <strong>Subscription and billing information:</strong> if you choose a paid plan, your
          plan, billing status and payment history. Card details are collected and processed
          directly by our payment provider, Stripe, and are not stored by Lab Unity.
        </p>
        <p>
          <strong>Technical information:</strong> IP address, browser and device type, pages
          requested, timestamps and security logs, collected automatically when you use the
          Platform.
        </p>
        <p>
          <strong>Support communications:</strong> the content of emails and requests you send to
          our support team.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    heading: 'How we use your information',
    content: (
      <>
        <p>We use personal data to:</p>
        <ul>
          <li>create and manage your account and authenticate you when you sign in;</li>
          <li>
            provide the Platform&apos;s features, including the professional directory, feed,
            groups, messaging, marketplace and recruitment tools;
          </li>
          <li>
            send service emails such as account confirmations, password resets, security alerts
            and important changes to our terms;
          </li>
          <li>process subscriptions and payments when you choose a paid plan;</li>
          <li>
            keep the Platform safe, including preventing fraud, spam and abuse and enforcing our{' '}
            <Link to={TERMS_PATH}>Terms of Service</Link>;
          </li>
          <li>respond to your support requests;</li>
          <li>maintain and improve the Platform and comply with our legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'legal-bases',
    heading: 'Legal bases for processing',
    content: (
      <>
        <p>
          Where data protection laws such as the EU or UK General Data Protection Regulation (GDPR)
          apply, we rely on the following legal bases:
        </p>
        <ul>
          <li>
            <strong>Contract:</strong> to provide the Platform and the services you have requested;
          </li>
          <li>
            <strong>Legitimate interests:</strong> to keep the Platform secure, prevent abuse and
            improve our services, balanced against your rights;
          </li>
          <li>
            <strong>Consent:</strong> where we ask for it, for example to list you in the
            professional contacts directory when you register. You can withdraw consent at any
            time;
          </li>
          <li>
            <strong>Legal obligation:</strong> where we must keep or disclose data to comply with
            the law.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'visibility',
    heading: 'What other members can see',
    content: (
      <>
        <p>
          Lab Unity is a professional network. Your profile, including your name, job title,
          company or laboratory, country, profile type, profile photo and professional
          information, is visible to other signed-in members and may appear in the professional
          contacts directory and in search results.
        </p>
        <p>
          Posts and comments are visible to the audience where you publish them, and private
          messages are visible to the members in that conversation. Your email address, phone
          number and password are not shown on your public profile.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    heading: 'How we share information',
    content: (
      <>
        <p>We do not sell your personal data. We share it only:</p>
        <ul>
          <li>
            with service providers who help us run the Platform, such as hosting and storage
            providers, email delivery services and our payment processor Stripe, under contracts
            that require them to protect your data and use it only on our instructions;
          </li>
          <li>with other members, as described in the section above;</li>
          <li>
            when required by law, court order or a competent authority, or to protect the rights,
            safety and property of Lab Unity, our members or others;
          </li>
          <li>
            in connection with a merger, acquisition or sale of assets, in which case this policy
            will continue to apply to your data.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and similar technologies',
    content: (
      <>
        <p>
          We use strictly necessary cookies to keep you signed in, remember your &quot;keep me
          signed in&quot; preference and protect your session. These cookies are required for the
          Platform to work and cannot be switched off without signing out.
        </p>
        <p>
          We do not use advertising cookies or third-party tracking cookies. If we introduce
          optional analytics in the future, we will update this policy and ask for your consent
          where required.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'Data retention',
    content: (
      <p>
        We keep your personal data for as long as your account is active and as needed to provide
        the Platform. When you close your account, we delete or anonymize your personal data
        within a reasonable period, unless we need to keep certain information to comply with
        legal, tax or accounting obligations, resolve disputes or enforce our agreements.
      </p>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    content: (
      <p>
        We use technical and organizational measures to protect your personal data, including
        encrypted connections (HTTPS), hashed passwords, access controls and rate limiting on
        sensitive actions such as sign-in and password reset. No online service can be completely
        secure, so please use a strong, unique password and keep it confidential.
      </p>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>access the personal data we hold about you and receive a copy of it;</li>
          <li>correct inaccurate or incomplete data;</li>
          <li>ask us to delete your data;</li>
          <li>restrict or object to certain processing;</li>
          <li>receive your data in a portable format;</li>
          <li>withdraw your consent at any time, where processing is based on consent;</li>
          <li>lodge a complaint with your local data protection authority.</li>
        </ul>
        <p>
          You can update most profile information from your account settings. To exercise any
          other right, email us at{' '}
          <a href={`mailto:${SUPPORT_CONTACT.email}`}>{SUPPORT_CONTACT.email}</a>. We may need to
          verify your identity before responding.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    heading: 'International data transfers',
    content: (
      <p>
        Our service providers may process data in countries other than your own. Where personal
        data is transferred outside the European Economic Area or the United Kingdom, we rely on
        appropriate safeguards such as adequacy decisions or Standard Contractual Clauses.
      </p>
    ),
  },
  {
    id: 'children',
    heading: 'Children',
    content: (
      <p>
        The Platform is intended for professionals aged 18 or over. We do not knowingly collect
        personal data from children. If you believe a child has provided us with personal data,
        please contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we make material changes we will
        update the &quot;Last updated&quot; date above and, where appropriate, notify you by email
        or through the Platform.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact us',
    content: (
      <p>
        If you have questions about this Privacy Policy or how we handle your personal data,
        please email us at <a href={`mailto:${SUPPORT_CONTACT.email}`}>{SUPPORT_CONTACT.email}</a>.
      </p>
    ),
  },
];

const PrivacyPolicyView = () => (
  <LegalDocument
    title="Privacy Policy"
    intro="This policy explains what personal data Lab Unity collects, how we use and protect it, and the choices and rights you have."
    sections={sections}
    related={{ to: TERMS_PATH, label: 'Terms of Service' }}
  />
);

export default PrivacyPolicyView;
