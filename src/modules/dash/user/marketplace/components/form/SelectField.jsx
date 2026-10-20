import { FormLabel, Select } from '@/components/form-controls';

/** Labelled select; `extraOption` renders first (e.g. a stored value missing from `options`). */
const SelectField = ({ id, label, value, onChange, options, disabled, extraOption = null }) => (
  <div>
    <FormLabel htmlFor={id}>
      {label}
    </FormLabel>
    <Select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
    >
      {extraOption}
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </Select>
  </div>
);

export default SelectField;
