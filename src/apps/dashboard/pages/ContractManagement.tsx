import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useContractStore } from '../../../store/contracts';
import ContractForm from '../components/ContractForm';
import ContractList from '../components/ContractList';
import { ContractRenewal } from '../../../types/contract';

const ContractManagement: React.FC = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedRenewal, setSelectedRenewal] = useState<ContractRenewal | undefined>();
  const { initialize } = useContractStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedContract(null);
    setSelectedRenewal(undefined);
  };

  const handleEditRenewal = (contractId: string, renewal: ContractRenewal) => {
    setSelectedContract(contractId);
    setSelectedRenewal(renewal);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('contracts.title')}</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('contracts.new')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractList
          onSelectContract={setSelectedContract}
          onAddRenewal={(contractId) => {
            setSelectedContract(contractId);
            setSelectedRenewal(undefined);
            setIsFormOpen(true);
          }}
          onEditRenewal={handleEditRenewal}
        />
        
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
              <ContractForm
                contractId={selectedContract}
                renewal={selectedRenewal}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractManagement;