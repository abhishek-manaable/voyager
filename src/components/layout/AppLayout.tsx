import React from 'react';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  navigation: {
    title: string;
    items: {
      icon: React.ComponentType;
      label: string;
      path: string;
    }[];
  };
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, navigation }) => {
  return (
    <div className="flex">
      <Navigation {...navigation} />
      <div className="flex-1 ml-64 px-8 pt-6 pb-20">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;