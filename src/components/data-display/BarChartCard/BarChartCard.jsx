import { ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '@/components/ui/Card';

const DEFAULT_CHART_HEIGHT = 240;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-md">
        <p className="mb-1 text-[12px] font-bold text-deep-blue">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#64748B]">{entry.name}:</span>
            <span className="font-semibold text-deep-blue">
              {entry.value >= 1000 ? `${entry.value / 1000}k` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BarChartCard = ({
  title,
  series = [],
  labels = [],
  yTicks = [],
  yMax,
  yearOptions = ['This year'],
  yearValue = 'This year',
  onYearChange,
  chartHeight = DEFAULT_CHART_HEIGHT,
  legendPosition = 'top',
  className = '',
}) => {
  // Transform props into Recharts data format
  const chartData = labels.map((label, index) => {
    const row = { name: label };
    series.forEach((item) => {
      row[item.id] = item.values[index] ?? 0;
    });
    return row;
  });

  const legend = (
    <div
      className={`flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 sm:px-5 ${
        legendPosition === 'bottom' ? 'pb-3 pt-2' : 'pb-0 pt-4'
      }`}
    >
      {series.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span className="text-[12px] font-medium text-[#64748B] sm:text-[13px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
        <h3 className="text-[16px] font-bold text-deep-blue sm:text-[17px]">{title}</h3>
        {yearOptions.length > 0 ? (
          <label className="relative inline-flex min-w-[120px] items-center">
            <select
              value={yearValue}
              onChange={(event) => onYearChange?.(event.target.value)}
              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-deep-blue outline-none focus:border-primary"
              aria-label="Chart period"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-[#64748B]" />
          </label>
        ) : null}
      </div>

      {legendPosition === 'top' ? legend : null}

      <div className="px-2 pb-4 pt-4 sm:px-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#98A2B3"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E4E7EC' }}
            />
            <YAxis
              stroke="#98A2B3"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={yTicks.length > 0 ? yTicks : undefined}
              domain={yMax ? [0, yMax] : [0, 'auto']}
              tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
            />
            <Tooltip content={<CustomTooltip />} />
            {series.map((item) => (
              <Bar
                key={item.id}
                dataKey={item.id}
                name={item.label}
                fill={item.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {legendPosition === 'bottom' ? legend : null}
    </Card>
  );
};

export default BarChartCard;
