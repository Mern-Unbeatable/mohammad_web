import { ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '@/components/ui/Card';
import { Select } from '@/components/form-controls';

const DEFAULT_CHART_HEIGHT = 240;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-md">
        <p className="mb-1 text-[12px] font-bold text-deep-blue">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 rounded-full"
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

const LineChartCard = ({
  title,
  series = [],
  labels = [],
  yTicks = [],
  yMax,
  yearOptions = ['This year', 'This month', 'Last 3 months', 'Last 6 months'],

  yearValue = 'This year',
  onYearChange,
  chartHeight = DEFAULT_CHART_HEIGHT,
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

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
        <h3 className="text-[16px] font-bold text-deep-blue">{title}</h3>
        {yearOptions.length > 0 ? (
          <label className="relative inline-flex min-w-[120px] items-center">
            <Select
              variant="compact"
              value={yearValue}
              onChange={(event) => onYearChange?.(event.target.value)}
              aria-label="Chart period"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-[#64748B]" />
          </label>
        ) : null}
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-4 sm:px-5">
        {series.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-[12px] font-medium text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Recharts LineChart */}
      <div className="px-2 pb-4 pt-4 sm:px-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
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
              <Line
                key={item.id}
                type="monotone"
                dataKey={item.id}
                name={item.label}
                stroke={item.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: item.color, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: item.color, stroke: '#ffffff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LineChartCard;
