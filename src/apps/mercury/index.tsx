import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Mail, Users, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import MarketingOverview from './pages/MarketingOverview';

export const MercuryApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.mercury'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/mercury'
      },
      {
        icon: Mail,
        label: 'Campaigns',
        path: '/mercury/campaigns'
      },
      {
        icon: Users,
        label: 'Contacts',
        path: '/mercury/contacts'
      },
      {
        icon: MessageSquare,
        label: 'Forms',
        path: '/mercury/forms'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<MarketingOverview />} />
      </Routes>
    </AppLayout>
  );
};