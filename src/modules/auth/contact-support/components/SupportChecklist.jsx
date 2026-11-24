import { CHECKLIST } from '../constant/constants';

/** "Please include in your message" list, worded for an appeal or a general request. */
const SupportChecklist = ({ isSuspension }) => (
  <div className="text-[14px] leading-[1.6] text-[#475467]">
    <p className="font-semibold text-deep-blue">Please include in your message</p>
    <ul className="mt-2 list-disc space-y-1 pl-5">
      <li>{CHECKLIST.common}</li>
      {(isSuspension ? CHECKLIST.suspension : CHECKLIST.general).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export default SupportChecklist;
