import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Trello, GitPullRequest, Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import ProductOverview from './pages/ProductOverview';

export const JupiterApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.jupiter'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/jupiter'
      },
      {
        icon: Trello,
        label: 'Roadmap',
        path: '/jupiter/roadmap'
      },
      {
        icon: GitPullRequest,
        label: 'Releases',
        path: '/jupiter/releases'
      },
      {
        icon: Bug,
        label: 'Issues',
        path: '/jupiter/issues'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<ProductOverview />} />
      </Routes>
    </AppLayout>
  );
};