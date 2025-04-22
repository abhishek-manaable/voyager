import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, MapPin } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { Office } from '../../../../types/hr';
import OfficeModal from './OfficeModal';

const OfficeList: React.FC = () => {
  const { t } = useTranslation();
  const { offices } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  const handleEdit = (office: Office) => {
    setSelectedOffice(office);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedOffice(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffice(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Offices
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Office
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.map((office) => (
          <div
            key={office.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {office.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {office.country}
                </p>
              </div>
              <button
                onClick={() => handleEdit(office)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{office.address}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <OfficeModal
          office={selectedOffice}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OfficeList;