import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppSwitcher from './AppSwitcher';
import Header from './Header';
import { DashboardApp } from '../../apps/dashboard';
import { SunApp } from '../../apps/sun';
import { MercuryApp } from '../../apps/mercury';
import { VenusApp } from '../../apps/venus';
import { MarsApp } from '../../apps/mars';
import { JupiterApp } from '../../apps/jupiter';
import { SaturnApp } from '../../apps/saturn';
import { UranusApp } from '../../apps/uranus';
import { NeptuneApp } from '../../apps/neptune';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <AppSwitcher />
        <div className="flex-1">
          <div className="ml-16">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/*" element={<DashboardApp />} />
                <Route path="/sun/*" element={<SunApp />} />
                <Route path="/mercury/*" element={<MercuryApp />} />
                <Route path="/venus/*" element={<VenusApp />} />
                <Route path="/mars/*" element={<MarsApp />} />
                <Route path="/jupiter/*" element={<JupiterApp />} />
                <Route path="/saturn/*" element={<SaturnApp />} />
                <Route path="/uranus/*" element={<UranusApp />} />
                <Route path="/neptune/*" element={<NeptuneApp />} />
              </Routes>
            </main>
            <footer className="fixed bottom-0 right-0 left-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} manaable Inc. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;