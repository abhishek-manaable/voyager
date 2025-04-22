import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Calendar, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import RenewalOverview from './pages/RenewalOverview';

export const MarsApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.mars'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/mars'
      },
      {
        icon: Calendar,
        label: 'Schedule',
        path: '/mars/schedule'
      },
      {
        icon: AlertCircle,
        label: 'Risk Management',
        path: '/mars/risk'
      },
      {
        icon: Clock,
        label: 'History',
        path: '/mars/history'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<RenewalOverview />} />
      </Routes>
    </AppLayout>
  );
};