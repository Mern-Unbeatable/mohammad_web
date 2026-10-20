import { fieldClass, labelClass } from './formStyles';

/** Labelled select; `extraOption` renders first (e.g. a stored value missing from `options`). */
const SelectField = ({ id, label, value, onChange, options, disabled, extraOption = null }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={fieldClass}
      disabled={disabled}
      required
    >
      {extraOption}
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
