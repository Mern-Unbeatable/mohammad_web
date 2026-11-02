/** Page title, subtitle, and a warning when Stripe isn't configured. */
const SubscriptionHeader = ({ paymentConfigured }) => (
  <>
    <h1 className="mt-5 text-[28px] font-bold leading-tight text-deep-blue sm:text-[34px]">
      Choose your billing cycle
    </h1>
    <p className="mt-2 text-[15px] text-[#64748B]">
      One plan. Full access. Pick how you want to pay.
    </p>

    {paymentConfigured ? null : (
      <p className="mt-3 text-[12px] text-[#DC2626]">
        Stripe is not configured on the server. Paid checkout is unavailable until Stripe keys
        and price IDs are set.
      </p>
    )}
  </>
);

export default SubscriptionHeader;
