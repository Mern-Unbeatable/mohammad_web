import { IoIosArrowDown } from "react-icons/io";
import { FormLabel, Select } from "@/components/form-controls";

const SelectField = ({ id, label, value, onChange, children, disabled }) => (
  <div>
    <FormLabel variant="auth" htmlFor={id}>
      {label}
    </FormLabel>
    <div className="relative">
      <Select
        variant="auth"
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none pr-10"
      >
        {children}
      </Select>
      <IoIosArrowDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#64748B]"
      />
    </div>
  </div>
);

export default SelectField;
