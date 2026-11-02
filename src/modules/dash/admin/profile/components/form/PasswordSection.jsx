import { panelPrimaryBtn } from "@/components/layout/panelPageTheme";
import { FormLabel, PasswordInput } from "@/components/form-controls";

const PASSWORD_FIELDS = [
  { key: "current", id: "current-password", label: "Current Password" },
  { key: "next", id: "new-password", label: "New Password" },
  { key: "confirm", id: "confirm-password", label: "Confirm New Password" },
];

/** Current / new / confirm password form with Change Password. */
const PasswordSection = ({ values, onChange, onSubmit }) => (
  <section className="mt-6 border-t border-[#E4E7EC] pt-5">
    <h2 className="text-[16px] font-bold text-deep-blue">Change Password</h2>
    <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PASSWORD_FIELDS.map(({ key, id, label }) => (
        <div key={key}>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <PasswordInput id={id} value={values[key]} onChange={(e) => onChange(key, e.target.value)} />
        </div>
      ))}
      <div className="sm:col-span-3 flex justify-end">
        <button type="submit" className={panelPrimaryBtn}>
          Change Password
        </button>
      </div>
    </form>
  </section>
);

export default PasswordSection;
