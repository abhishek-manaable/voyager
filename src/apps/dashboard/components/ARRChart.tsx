import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useContractStore } from '../../../store/contracts';
import { useTargetStore } from '../../../store/targets';

interface TimeRange {
  value: string;
  label: string;
  months: number;
}

const ARRChart: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState<string>('1y');
  const [data, setData] = useState<any[]>([]);
  const { getARRData } = useContractStore();
  const { targets } = useTargetStore();

  const timeRanges: TimeRange[] = [
    { value: '1y', label: t('chart.arr.period.1y'), months: 12 },
    { value: '2y', label: t('chart.arr.period.2y'), months: 24 },
    { value: '3y', label: t('chart.arr.period.3y'), months: 36 },
    { value: 'all', label: t('chart.arr.period.all'), months: 0 },
  ];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    const range = timeRanges.find(r => r.value === selectedRange) || timeRanges[0];
    let startDate: Date;

    if (range.value === 'all') {
      startDate = new Date(2021, 3, 1); // 2021年4月から
    } else {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - range.months);
    }
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12); // 1年先まで表示（ターゲット用）

    const arrData = getARRData(startDate, endDate);

    // 現在の日付を取得
    const currentDate = new Date();

    const enrichedData = arrData.map(item => {
      const [year, month] = item.date.split('-').map(Number);
      const itemDate = new Date(year, month - 1);

      return {
        ...item,
        // 現在月より後のARRはnullに設定
        totalARR: itemDate <= currentDate ? item.totalARR : null,
        // すべての期間のターゲットを表示
        target: targets.find(t => t.year === year && t.month === Number(month))?.targetAmount || null
      };
    });

    setData(enrichedData);
  }, [selectedRange, getARRData, targets]);

  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    return `${year}/${month}`;
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-900 dark:text-white font-medium mb-2">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value as number)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('chart.arr.title')}</h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedRange === range.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              stroke="#9CA3AF"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              width={100}
              stroke="#9CA3AF"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalARR"
              name="ARR"
              stroke="#19b184"
              strokeWidth={2}
              dot={true}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={true}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ARRChart;