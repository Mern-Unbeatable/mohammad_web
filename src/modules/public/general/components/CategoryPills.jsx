import { GENERAL_CATEGORY_OPTIONS } from '@/features/dash/user/general';

const CategoryPills = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {GENERAL_CATEGORY_OPTIONS.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            active
              ? 'bg-primary text-white'
              : 'bg-white text-[#475467] ring-1 ring-[#E4E7EC] hover:bg-[#F9FAFB]'
          }`}
        >
          {option}
        </button>
      );
    })}
  </div>
);

export default CategoryPills;
