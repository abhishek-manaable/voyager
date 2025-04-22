import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Target,
  Percent,
  Users,
  Award
} from 'lucide-react';
import ARRChart from '../components/ARRChart';
import { useContractStore } from '../../../store/contracts';
import { useTargetStore } from '../../../store/targets';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { getARRData, contracts } = useContractStore();
  const { targets } = useTargetStore();

  const kpiData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 会計年度の計算（4月始まり）
    const fiscalYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const fiscalQuarter = Math.floor((currentMonth - 4) / 3) + 1;

    // 現在のARRを計算
    const currentARR = getARRData(now, now)[0]?.totalARR || 0;

    // 1年前のARRを計算
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    const lastYearARR = getARRData(lastYear, lastYear)[0]?.totalARR || 0;

    // YoY成長率を計算
    const yoyGrowth = lastYearARR > 0 
      ? ((currentARR - lastYearARR) / lastYearARR * 100)
      : 0;

    // 現在の四半期のターゲットを取得
    const currentQuarterMonths = Array.from(
      { length: 3 },
      (_, i) => ((fiscalQuarter - 1) * 3 + i + 4) % 12 || 12
    );
    const quarterTarget = currentQuarterMonths
      .map(month => targets.find(t => t.year === fiscalYear && t.month === month)?.targetAmount || 0)
      .reduce((max, current) => Math.max(max, current), 0);

    // ターゲットに対する進捗率を計算
    const progressPercentage = quarterTarget > 0
      ? (currentARR / quarterTarget * 100)
      : 0;

    // NRRの計算
    // 1年前の月初めと月末を設定
    const lastYearStart = new Date(lastYear.getFullYear(), lastYear.getMonth(), 1);
    const lastYearEnd = new Date(lastYear.getFullYear(), lastYear.getMonth() + 1, 0);

    // 1年前に存在していた契約を抽出
    const lastYearContracts = contracts.filter(contract => {
      const hasLastYearRenewal = contract.renewals.some(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= lastYearEnd && renewalEnd >= lastYearStart;
      });
      return hasLastYearRenewal;
    });

    // 現在の月初めと月末を設定
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 1年前の既存顧客のARRを計算（同一クライアントの複数の有効な取引を合算）
    const lastYearExistingARR = lastYearContracts.reduce((total, contract) => {
      // 1年前の時点での有効な更新をすべて取得
      const lastYearRenewals = contract.renewals.filter(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= lastYearEnd && renewalEnd >= lastYearStart;
      });
      
      // 該当する更新の年間価値を合計
      const contractTotal = lastYearRenewals.reduce((sum, renewal) => 
        sum + renewal.annualValue, 0);
      
      return total + contractTotal;
    }, 0);

    // 現在の既存顧客のARRを計算（同一クライアントの複数の有効な取引を合算）
    const currentExistingARR = lastYearContracts.reduce((total, contract) => {
      // 現在時点での有効な更新をすべて取得
      const currentRenewals = contract.renewals.filter(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= currentEnd && renewalEnd >= currentStart;
      });
      
      // 該当する更新の年間価値を合計
      const contractTotal = currentRenewals.reduce((sum, renewal) => 
        sum + renewal.annualValue, 0);
      
      return total + contractTotal;
    }, 0);

    // NRRを計算
    const nrr = lastYearExistingARR > 0
      ? (currentExistingARR / lastYearExistingARR * 100)
      : 100;

    // 前年のNRRを計算（2年前と1年前の比較）
    const twoYearsAgo = new Date(lastYear);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 1);

    // 2年前の月初めと月末を設定
    const twoYearsAgoStart = new Date(twoYearsAgo.getFullYear(), twoYearsAgo.getMonth(), 1);
    const twoYearsAgoEnd = new Date(twoYearsAgo.getFullYear(), twoYearsAgo.getMonth() + 1, 0);

    const twoYearsAgoContracts = contracts.filter(contract => {
      const hasTwoYearsAgoRenewal = contract.renewals.some(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= twoYearsAgoEnd && renewalEnd >= twoYearsAgoStart;
      });
      return hasTwoYearsAgoRenewal;
    });

    // 2年前のARRを計算（同一クライアントの複数の有効な取引を合算）
    const twoYearsAgoARR = twoYearsAgoContracts.reduce((total, contract) => {
      const oldRenewals = contract.renewals.filter(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= twoYearsAgoEnd && renewalEnd >= twoYearsAgoStart;
      });
      return total + oldRenewals.reduce((sum, renewal) => sum + renewal.annualValue, 0);
    }, 0);

    // 1年前のARRを計算（2年前からの既存顧客のみ）
    const lastYearForOldNRR = twoYearsAgoContracts.reduce((total, contract) => {
      const oldRenewals = contract.renewals.filter(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        return renewalStart <= lastYearEnd && renewalEnd >= lastYearStart;
      });
      return total + oldRenewals.reduce((sum, renewal) => sum + renewal.annualValue, 0);
    }, 0);

    const lastYearNRR = twoYearsAgoARR > 0
      ? (lastYearForOldNRR / twoYearsAgoARR * 100)
      : 100;

    // NRRの変化率を計算
    const nrrChange = (nrr - lastYearNRR).toFixed(1);

    return {
      arr: {
        value: currentARR,
        change: yoyGrowth.toFixed(1),
      },
      progress: {
        value: progressPercentage.toFixed(1),
        target: quarterTarget,
        quarter: fiscalQuarter,
      },
      nrr: {
        value: nrr.toFixed(1),
        change: nrrChange,
      },
    };
  }, [getARRData, targets, contracts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const moonMetricsCards = [
    {
      title: t('dashboard.kpi.arr'),
      value: formatCurrency(kpiData.arr.value),
      change: `${kpiData.arr.change}% YoY`,
      icon: TrendingUp,
    },
    {
      title: t('dashboard.kpi.arrProgress'),
      value: `${kpiData.progress.value}%`,
      change: `Q${kpiData.progress.quarter} ${formatCurrency(kpiData.progress.target)} Target`,
      icon: Target,
    },
    {
      title: t('dashboard.kpi.nrr'),
      value: `${kpiData.nrr.value}%`,
      change: `${kpiData.nrr.change}pts YoY`,
      icon: Percent,
    },
  ];

  const northStarCards = [
    {
      title: t('dashboard.kpi.trainingApplicants'),
      value: "1,234",
      change: "+12.3% MoM",
      icon: Users,
    },
    {
      title: t('dashboard.kpi.trainingCompletion'),
      value: "87.5%",
      change: "+2.5pts MoM",
      icon: Award,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Moon Metrics Section */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.metrics.moon')}
        </h2>
        
        <div className="grid grid-cols-3 gap-6">
          {moonMetricsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <card.icon className="w-8 h-8 text-primary-500" />
              </div>
              <p className={`mt-2 text-sm ${
                card.title === t('dashboard.kpi.nrr')
                  ? Number(kpiData.nrr.change) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                  : 'text-green-500'
              }`}>
                {card.change}
              </p>
            </div>
          ))}
        </div>

        <ARRChart />
      </div>

      {/* North Star Metrics Section */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.metrics.northStar')}
        </h2>
        
        {northStarCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <card.icon className="w-8 h-8 text-primary-500" />
            </div>
            <p className={`mt-2 text-sm ${
              Number(card.change.replace(/[^-\d.]/g, '')) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;