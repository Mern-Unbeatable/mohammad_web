import { Link } from 'react-router';
import { TERMS_PATH } from '../constant/constants';
import { CONTACT_EMAIL } from '@/modules/public/contact/constant/constants';

const COMPANY = {
  name: 'Global Medical Transport SRL',
  address: 'Chaussée de Bruxelles 176, 6040 Jumet, Belgium',
  enterpriseNumber: '1021.030.215',
  vat: 'BE 1021.030.215',
  email: CONTACT_EMAIL,
};

export const PRIVACY_POLICY = {
  badge: 'Privacy',
  title: 'Privacy Policy',
  intro:
    'This policy explains who processes your data on LabUnity.be, what we use, why we use it, who receives it, how long we keep it, and your rights — including how cookies and similar technologies are managed.',
  related: { to: TERMS_PATH, label: 'Terms of Use and Sale' },
};

export const PRIVACY_SECTIONS = [
  {
    id: 'controller',
    heading: 'Who processes your data?',
    content: (
      <>
        <p>
          {COMPANY.name}, {COMPANY.address}, enterprise number {COMPANY.enterpriseNumber}, VAT{' '}
          {COMPANY.vat}, is the controller for the operation of LabUnity.be and its app. For
          questions or requests about your data, contact{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or write to our registered office.
        </p>
        <p>
          This policy should be read together with our{' '}
          <Link to={TERMS_PATH}>Terms of Use and Sale</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'data-we-use',
    heading: 'What data do we use?',
    content: (
      <>
        <p>
          We process information you provide, including contact, account and profile details,
          information about your organisation, posts, listings, messages and support
          communications. Orders, subscriptions and seller onboarding may involve transaction
          references, invoicing details and, where necessary, verification information. Use of the
          service generates technical data such as IP addresses, browser details and sign-in logs.
        </p>
        <p>
          We may receive information from the organisation that adds you to an account, another
          member who reports or mentions you, or a payment provider that confirms a transaction.
          Where required, we inform people whose data was collected indirectly. Please do not share
          patient records, identifiable test results or other identifiable health data through the
          service.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-use',
    heading: 'Why do we use this data?',
    content: (
      <>
        <ul>
          <li>
            <strong>Accounts and features.</strong> We use the data needed to create your account,
            display your profile according to its visibility settings, publish content, deliver
            messages and provide requested features and subscriptions. The legal basis is
            performance of a contract or steps taken at your request before entering into a contract
            where you are a party to it. For contacts at a customer organisation, our legitimate
            interest may be to manage the business relationship.
          </li>
          <li>
            <strong>Marketplace and billing.</strong> We process orders, subscriptions, payments and
            support requests to perform the contract. We retain tax records and verify or report
            certain seller information where legally required.
          </li>
          <li>
            <strong>Security and moderation.</strong> Our legitimate interests include fraud
            prevention, account protection, processing reports and defending our rights, subject to
            your rights and freedoms. Some processing also fulfils legal obligations.
          </li>
          <li>
            <strong>Audience measurement and marketing.</strong> Where consent is required, we ask
            before using trackers or sending marketing communications. You can withdraw consent at
            any time.
          </li>
        </ul>
        <p>
          Required fields are identified when data is collected. If information needed for an
          account or order is missing, we may be unable to provide the service requested.
        </p>
      </>
    ),
  },
  {
    id: 'recipients',
    heading: 'Who receives your data?',
    content: (
      <>
        <p>
          People with access to a page can see public information according to your settings.
          Messages are intended for the chosen recipients. Authorised people may access relevant
          information where necessary to provide support, handle a report or comply with the law.
          Information needed for a sale is shared with the other party. Sellers are responsible for
          processing data for their own obligations.
        </p>
        <p>
          Hosting, email, payment, support or analytics providers may receive data needed for the
          services they actually perform. Providers may act as processors or separate controllers,
          depending on their role. Data may be disclosed to competent authorities where legally
          required.
        </p>
      </>
    ),
  },
  {
    id: 'transfers-retention',
    heading: 'Transfers and retention',
    content: (
      <>
        <p>
          Service providers may process data in countries other than your own. Where personal data
          is transferred outside the European Economic Area, we rely on appropriate safeguards such
          as adequacy decisions or Standard Contractual Clauses. You may request information about
          those safeguards by contacting{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
        <p>We keep data according to its purpose:</p>
        <ul>
          <li>
            <strong>Accounts and profiles:</strong> for as long as the account remains active, then
            deleted or anonymised within a reasonable period after closure;
          </li>
          <li>
            <strong>Posts and messages:</strong> while the content remains on the service, then
            subject to temporary backups and mandatory retention after deletion;
          </li>
          <li>
            <strong>Transactions and invoices:</strong> for the applicable statutory period;
          </li>
          <li>
            <strong>Security logs and reports:</strong> for as long as needed for security,
            investigation and legal defence;
          </li>
          <li>
            <strong>Cookie preferences:</strong> for as long as needed to honour your choices.
          </li>
        </ul>
        <p>
          Data needed for a dispute or legal duty may be kept for the required period.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'What are your rights?',
    content: (
      <>
        <p>
          Depending on the processing, you may request access, rectification, erasure, restriction
          or portability. You may object to processing based on legitimate interests on grounds
          relating to your situation, and object to direct marketing at any time. You can withdraw
          consent without affecting earlier lawful processing. Contact{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. We may ask for proof of identity
          if we have reasonable doubts.
        </p>
        <p>
          You may complain to the Belgian Data Protection Authority (
          <a
            href="https://www.dataprotectionauthority.be"
            target="_blank"
            rel="noopener noreferrer"
          >
            dataprotectionauthority.be
          </a>
          ) or the competent authority where you live or work or where the alleged infringement
          occurred.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and similar technologies',
    content: (
      <p>
        A cookie is a small file used by a website. The same choices apply to similar technologies
        when they store or access information on your device. Strictly necessary trackers, for
        example those essential to keep you signed in or remember your privacy choices, may be used
        without consent. Optional trackers, such as most analytics tools, social integrations or
        advertising, remain disabled until you agree to the relevant purpose, if such tools are
        used.
      </p>
    ),
  },
  {
    id: 'cookie-choices',
    heading: 'Managing your cookie choices',
    content: (
      <p>
        On your first visit you can select &quot;Accept all&quot;, &quot;Reject all&quot; or
        &quot;Customise&quot;. Optional categories are off by default. Change your choices or
        withdraw consent at any time via the Cookie preferences control on the site. Rejecting
        optional trackers does not block essential features. Some optional integrations may remain
        disabled.
      </p>
    ),
  },
  {
    id: 'tracker-list',
    heading: 'Tracker list',
    content: (
      <>
        <p>
          The following categories describe trackers that may be used on the website and app.
          Unused categories are not enabled.
        </p>
        <ul>
          <li>
            <strong>Strictly necessary:</strong> session and authentication cookies required to keep
            you signed in, protect your account and remember essential privacy choices. These are
            first-party and last for the session or until you sign out / clear site data.
          </li>
          <li>
            <strong>Payment:</strong> when you subscribe or pay, Stripe may set cookies or similar
            technologies needed to process the payment securely. Stripe acts according to its role
            as payment provider.
          </li>
          <li>
            <strong>Optional analytics, social or advertising:</strong> disabled by default and only
            used if you consent to the relevant purpose.
          </li>
        </ul>
      </>
    ),
  },
];
