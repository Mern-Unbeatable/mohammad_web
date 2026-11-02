import { SUBSCRIPTION_PILL_STYLES } from "../../constant/constants";

const SubscriptionPill = ({ label }) => {
  const styles = SUBSCRIPTION_PILL_STYLES[label] || SUBSCRIPTION_PILL_STYLES.Free;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles}`}
    >
      {label}
    </span>
  );
};

export default SubscriptionPill;
