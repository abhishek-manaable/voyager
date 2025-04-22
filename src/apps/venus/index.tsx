import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Heart, Activity, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import CustomerSuccessOverview from './pages/CustomerSuccessOverview';

export const VenusApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.venus'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/venus'
      },
      {
        icon: Heart,
        label: 'Health Score',
        path: '/venus/health'
      },
      {
        icon: Activity,
        label: 'Usage Analytics',
        path: '/venus/usage'
      },
      {
        icon: MessageCircle,
        label: 'Feedback',
        path: '/venus/feedback'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<CustomerSuccessOverview />} />
      </Routes>
    </AppLayout>
  );
};