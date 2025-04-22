import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import EmployeeModal from './EmployeeModal';

const EmployeeList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employees, departments, offices } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalInfo.phone.includes(searchTerm)
    );
    const matchesDepartment = !departmentFilter || employee.departmentId === departmentFilter;
    const matchesOffice = !officeFilter || employee.officeId === officeFilter;
    const matchesStatus = !statusFilter || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesOffice && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employees
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.nameEn}
              </option>
            ))}
          </select>

          <select
            value={officeFilter}
            onChange={(e) => setOfficeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Offices</option>
            {offices.map(office => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="leave">On Leave</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Office
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => {
                const department = departments.find(d => d.id === employee.departmentId);
                const office = offices.find(o => o.id === employee.officeId);
                
                return (
                  <tr
                    key={employee.id}
                    onClick={() => navigate(`/saturn/employees/${employee.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {department?.nameEn}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {department?.nameJa}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {office?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {employee.joinDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : employee.status === 'leave'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeList;