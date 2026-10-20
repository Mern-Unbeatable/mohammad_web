import { panelPrimaryBtn } from "@/components/layout/panelPageTheme";
import { FormLabel, Input } from "@/components/form-controls";

/** Name / email form with Update Profile. */
const AccountInfoSection = ({ values, onChange, onSubmit }) => (
  <section className="mt-5">
    <h2 className="text-[16px] font-bold text-deep-blue">Account Information</h2>
    <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FormLabel htmlFor="admin-name">Name</FormLabel>
        <Input
          id="admin-name"
          type="text"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="admin-email">Email</FormLabel>
        <Input
          id="admin-email"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" className={panelPrimaryBtn}>
          Update Profile
        </button>
      </div>
    </form>
  </section>
);

export default AccountInfoSection;
