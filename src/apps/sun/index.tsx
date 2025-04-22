import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Users, Target, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import SalesOverview from './pages/SalesOverview';

export const SunApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.sun'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/sun'
      },
      {
        icon: Users,
        label: 'Leads',
        path: '/sun/leads'
      },
      {
        icon: Target,
        label: 'Opportunities',
        path: '/sun/opportunities'
      },
      {
        icon: FileText,
        label: 'Quotes',
        path: '/sun/quotes'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<SalesOverview />} />
      </Routes>
    </AppLayout>
  );
};