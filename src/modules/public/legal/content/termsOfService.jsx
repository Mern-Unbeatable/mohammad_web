import { Link } from 'react-router';
import { PRIVACY_PATH } from '../constant/constants';
import { CONTACT_SUPPORT_PATH } from '@/shared/constants/support';
import { CONTACT_EMAIL } from '@/modules/public/contact/constant/constants';

const COMPANY = {
  name: 'Global Medical Transport SRL',
  address: 'Chaussée de Bruxelles 176, 6040 Jumet, Belgium',
  enterpriseNumber: '1021.030.215',
  vat: 'BE 1021.030.215',
  email: CONTACT_EMAIL,
};

export const TERMS_OF_SERVICE = {
  title: 'Terms of Use and Sale',
  intro:
    'These terms apply to profiles, posts, messaging, the marketplace, and subscriptions and other services sold by Global Medical Transport SRL under the LabUnity name.',
  related: { to: PRIVACY_PATH, label: 'Privacy Policy' },
};

export const TERMS_SECTIONS = [
  {
    id: 'operator-scope',
    heading: 'Operator and scope',
    content: (
      <>
        <p>
          LabUnity.be is operated by {COMPANY.name}, {COMPANY.address}, Belgian Crossroads Bank for
          Enterprises number {COMPANY.enterpriseNumber}, VAT {COMPANY.vat}. LabUnity contact:{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
        <p>
          These terms apply to profiles, posts, messaging, the marketplace, and subscriptions and
          other services sold by {COMPANY.name} under the LabUnity name. The features and specific
          terms of each offer are provided before an order is placed.
        </p>
      </>
    ),
  },
  {
    id: 'accounts-use',
    heading: 'Accounts and acceptable use',
    content: (
      <>
        <p>
          Members must provide accurate information, safeguard their login credentials and report
          suspected unauthorised access. Anyone acting for an organisation must be authorised to
          represent it. LabUnity may verify sellers&apos; identity and status and request supporting
          evidence before allowing sales.
        </p>
        <p>
          Members must respect third-party rights and the confidentiality of communications. Fraud,
          impersonation, harassment, threats, unsolicited commercial messages and unlawful content
          are prohibited. Profiles, listings, posts and messages must not contain patient records,
          identifiable test results or other identifiable health data.
        </p>
      </>
    ),
  },
  {
    id: 'content-messaging',
    heading: 'Content, messaging and moderation',
    content: (
      <>
        <p>
          Members retain their rights in their content. They grant LabUnity a non-exclusive,
          royalty-free right to host, display or transmit it according to its visibility settings
          and to make technical adaptations needed to provide the service. This permission ends when
          the content is removed, subject to temporary backups and mandatory retention requirements.
          Messages are intended for the chosen recipients and their processing is described in the{' '}
          <Link to={PRIVACY_PATH}>Privacy Policy</Link>.
        </p>
        <p>
          Report unlawful content via our{' '}
          <Link to={CONTACT_SUPPORT_PATH}>support page</Link>, specifying its precise location and
          why it is unlawful. DSA contact point: {COMPANY.name}, {COMPANY.address}; accepted
          languages: English, French and Dutch. Depending on the seriousness and circumstances,
          LabUnity may remove content, reduce its visibility, restrict features or suspend an
          account. Where required by law, LabUnity will explain its decision and how to challenge
          it. Challenges may be submitted via our{' '}
          <Link to={CONTACT_SUPPORT_PATH}>support page</Link> or by emailing{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'marketplace-sales',
    heading: 'Marketplace sales',
    content: (
      <>
        <p>
          For a third-party offer, the sale contract is concluded with the seller identified in the
          offer. The seller is responsible for the description, conformity, delivery, returns and
          guarantees that fall within its obligations. LabUnity remains responsible for its own
          obligations. Offers sold directly by {COMPANY.name} are labelled accordingly.
        </p>
        <p>
          Where consumers can buy, the marketplace indicates before checkout whether the seller has
          declared itself a trader or a private seller, and how relevant obligations are shared
          between the seller and LabUnity. Where the seller is a private individual, EU consumer
          protection rights applicable to contracts between traders and consumers do not apply to
          that sale. The main ranking parameters and their relative importance are available from
          the search results. Paid placements are identified.
        </p>
        <p>
          Sellers must accurately describe each product, its condition, its price and its delivery
          terms. Counterfeit goods and unlawful offers are prohibited. Human biological samples,
          medicinal products and hazardous materials are excluded. Other regulated products are
          allowed only in expressly opened categories and subject to applicable requirements.
        </p>
      </>
    ),
  },
  {
    id: 'orders-payment',
    heading: 'Orders, prices, payment and complaints',
    content: (
      <>
        <p>
          Buyers can review their order and correct errors before confirming it. The total price,
          taxes and applicable charges are disclosed before commitment. Consumer prices include VAT
          where due. The paid order button clearly indicates the obligation to pay. Confirmation is
          provided on a durable medium.
        </p>
        <p>
          If payment is integrated, Stripe processes transactions under the terms displayed. Seller
          fees, payouts, refunds and account restrictions are set out in the applicable seller
          terms. For third-party sales, buyers contact the seller about delivery, returns or
          guarantees and may contact LabUnity for platform-related issues.
        </p>
        <p>
          Consumers buying goods online from a trader generally have 14 calendar days from receipt
          to withdraw, subject to legal exceptions. The recipient of a withdrawal request, the
          return procedure and any direct return costs are disclosed before purchase. Statutory
          guarantees remain applicable.
        </p>
      </>
    ),
  },
  {
    id: 'transport',
    heading: 'Transport services',
    content: (
      <p>
        Where transport is offered under the Global Medical Transport name, the contract is with{' '}
        {COMPANY.name}. The price, route, timing, packaging and transport terms are confirmed before
        booking. {COMPANY.name} invoices the service.
      </p>
    ),
  },
  {
    id: 'subscriptions',
    heading: 'Subscriptions and cancellation',
    content: (
      <>
        <p>
          {COMPANY.name} provides and invoices LabUnity subscriptions. Features, price per period,
          payment frequency, term, renewal and cancellation are displayed before purchase and
          repeated in the confirmation on a durable medium.
        </p>
        <p>
          Monthly subscriptions are billed for one month at a time and renew automatically where the
          offer so provides. Subscribers may cancel without penalty by emailing{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Requests received before the next
          renewal take effect at the end of the current period. LabUnity confirms the end date.
          Statutory rights remain applicable.
        </p>
        <p>
          Where a three-month business plan is offered, its initial term, total price and payment
          schedule are shown before purchase. It ends automatically at expiry unless expressly
          renewed. Early termination rights under the contract or the law remain applicable.
        </p>
        <p>
          For fixed-term consumer service plans with automatic renewal, the renewal clause is
          displayed in the required box on the first page of the contract. After the first automatic
          renewal, consumers may terminate at any time without penalty. Any applicable notice period
          is capped at two months, and any more favourable offer terms remain available.
        </p>
      </>
    ),
  },
  {
    id: 'withdrawal',
    heading: 'Subscription withdrawal and conformity',
    content: (
      <>
        <p>
          Consumers generally have 14 calendar days from concluding an online subscription to
          withdraw. They can use the withdrawal function where available, or send a clear statement
          to {COMPANY.name}, {COMPANY.address}, or{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. LabUnity refunds payments within
          the statutory period, generally using the original payment method. Where a consumer
          expressly requested early performance, a proportionate amount for services already
          supplied may be due under the statutory conditions. Activation alone does not remove the
          right of withdrawal. Statutory remedies for lack of conformity remain available.
        </p>
        <p>
          <strong>Optional withdrawal form.</strong> To {COMPANY.name}, {COMPANY.address},{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. I hereby give notice that I
          withdraw from the contract for [goods or service], ordered on [date] or received on
          [date]. Name, address and date [complete as appropriate]. Sign only if submitting on
          paper.
        </p>
      </>
    ),
  },
  {
    id: 'changes-closure',
    heading: 'Changes, account closure and privacy',
    content: (
      <>
        <p>
          Material changes are notified in advance on a durable medium, with their effective date
          and applicable termination rights. Subscription price increases are communicated before
          the affected period so subscribers can decline renewal. Specific rules for business
          sellers apply where relevant.
        </p>
        <p>
          Members may request account closure via our{' '}
          <Link to={CONTACT_SUPPORT_PATH}>support page</Link> or by emailing{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. LabUnity explains the effects on
          their data, subscription and pending transactions. Closure does not extinguish rights
          relating to orders, guarantees or refunds. Personal data processing and individual rights
          are described in the <Link to={PRIVACY_PATH}>Privacy Policy</Link>. Cookie choices are
          available in the <Link to={`${PRIVACY_PATH}#cookies`}>Cookie Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'liability-disputes',
    heading: 'Liability and disputes',
    content: (
      <>
        <p>
          {COMPANY.name} is responsible for its obligations under applicable law. Mandatory rights,
          statutory guarantees and remedies remain available. LabUnity complaints may be sent to{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. After attempting direct
          resolution, consumers may, where appropriate, contact the Belgian Consumer Mediation
          Service (
          <a
            href="https://mediationconsommateur.be"
            target="_blank"
            rel="noopener noreferrer"
          >
            mediationconsommateur.be
          </a>
          ). Belgian law applies subject to mandatory protections in the consumer&apos;s country of
          habitual residence. Jurisdiction is determined under the applicable rules.
        </p>
      </>
    ),
  },
];
