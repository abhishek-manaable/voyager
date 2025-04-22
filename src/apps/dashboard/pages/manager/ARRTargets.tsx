import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Calendar } from 'lucide-react';
import { useTargetStore } from '../../../../store/targets';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserRole } from '../../../../types/auth';

type ViewRange = '6m' | '1y' | '2y' | 'all';

const ARRTargets: React.FC = () => {
  const { t } = useTranslation();
  const { targets, addTarget, updateTarget, initialize } = useTargetStore();
  const { authUser } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [viewRange, setViewRange] = useState<ViewRange>('6m');

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  const canEdit = authUser?.role === UserRole.ADMIN || authUser?.role === UserRole.MANAGER;

  // 表示期間の計算
  const getDisplayMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    let startDate: Date;
    let endDate = new Date(currentYear + 1, 11, 31); // 常に来年末まで表示

    switch (viewRange) {
      case '6m':
        startDate = new Date(currentYear, currentMonth - 1, 1);
        break;
      case '1y':
        startDate = new Date(currentYear - 1, currentMonth - 1, 1);
        break;
      case '2y':
        startDate = new Date(currentYear - 2, currentMonth - 1, 1);
        break;
      case 'all':
        startDate = new Date(2021, 3, 1); // 2021年4月から
        break;
      default:
        startDate = new Date(currentYear, currentMonth - 1, 1);
    }

    const months: { year: number; month: number }[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  const displayMonths = getDisplayMonths();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYearMonth = (year: number, month: number) => {
    return `${year}/${month.toString().padStart(2, '0')}`;
  };

  const startEditing = (target?: { id: string; targetAmount: number }) => {
    if (!canEdit) return;
    setEditingId(target?.id || null);
    setEditingValue(target?.targetAmount?.toString() || '');
  };

  const handleSave = async (year: number, month: number, value: string, id?: string) => {
    if (!canEdit) return;
    
    const numericValue = Number(value);
    if (isNaN(numericValue)) return;
    
    try {
      if (id) {
        await updateTarget(id, { targetAmount: numericValue });
      } else {
        await addTarget({
          year,
          month,
          targetAmount: numericValue,
        });
      }
      setEditingId(null);
      setEditingValue('');
    } catch (error) {
      console.error('Error saving target:', error);
    }
  };

  const viewRangeOptions: { value: ViewRange; label: string }[] = [
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '2y', label: '2 Years' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('targets.title')}
        </h1>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {viewRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setViewRange(option.value)}
                className={`px-3 py-1 rounded-md text-sm ${
                  viewRange === option.value
                    ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="pb-3 text-left text-gray-900 dark:text-white">{t('targets.year')}</th>
                <th className="pb-3 text-right text-gray-900 dark:text-white">{t('targets.amount')}</th>
                <th className="pb-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {displayMonths.map(({ year, month }) => {
                const target = targets.find(
                  (t) => t.year === year && t.month === month
                );
                const isEditing = editingId === target?.id || 
                  (!target && editingId === `${year}-${month}`);

                return (
                  <tr
                    key={`${year}-${month}`}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="py-4 text-gray-900 dark:text-white">
                      {formatYearMonth(year, month)}
                    </td>
                    <td className="py-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full px-3 py-1 text-right border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          onBlur={() => handleSave(year, month, editingValue, target?.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSave(year, month, editingValue, target?.id);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingValue('');
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => {
                            if (canEdit && !target) {
                              setEditingId(`${year}-${month}`);
                              setEditingValue('');
                            }
                          }}
                          className={`cursor-${canEdit ? 'pointer' : 'default'} hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded text-gray-900 dark:text-white`}
                        >
                          {target?.targetAmount ? formatCurrency(target.targetAmount) : '-'}
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {canEdit && target && !isEditing && (
                        <button
                          onClick={() => startEditing(target)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ARRTargets;