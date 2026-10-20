import { IoIosArrowDown } from "react-icons/io";
import { inputClass, labelClass } from "@/modules/auth/components/AuthFormFields";

const selectClass = `${inputClass} appearance-none pr-10`;

const SelectField = ({ id, label, value, onChange, children, disabled }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClass}
      >
        {children}
      </select>
      <IoIosArrowDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#64748B]"
      />
    </div>
  </div>
);

export default SelectField;
