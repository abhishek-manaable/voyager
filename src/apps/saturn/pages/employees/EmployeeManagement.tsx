import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeDetail from './EmployeeDetail';

const EmployeeManagement: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeList />} />
      <Route path="/:id" element={<EmployeeDetail />} />
    </Routes>
  );
};

export default EmployeeManagement;