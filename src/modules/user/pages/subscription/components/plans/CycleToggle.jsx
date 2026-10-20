import { cycleKey } from '../../utils/plans';

const CycleToggle = ({ planOptions, cycle, onChange }) => (
  <div className="mt-6 inline-flex w-full max-w-[360px] rounded-xl bg-[#F3F4F6] p-1 sm:w-auto">
    {Object.values(planOptions).map((option) => {
      const key = cycleKey(option.id);
      return (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(key)}
          className={`flex-1 rounded-lg px-6 py-2.5 text-[13px] font-semibold transition-all sm:min-w-[140px] ${
            cycle === key ? 'bg-primary text-white shadow-sm' : 'text-[#64748B] hover:text-deep-blue'
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export default CycleToggle;
