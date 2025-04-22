import React from 'react';
import { useTranslation } from 'react-i18next';
import { useContractStore } from '../../../store/contracts';
import { Plus, Edit2 } from 'lucide-react';
import { ContractRenewal } from '../../../types/contract';

interface ContractListProps {
  onSelectContract: (contractId: string) => void;
  onAddRenewal: (contractId: string) => void;
  onEditRenewal: (contractId: string, renewal: ContractRenewal) => void;
}

const ContractList: React.FC<ContractListProps> = ({ 
  onSelectContract, 
  onAddRenewal,
  onEditRenewal 
}) => {
  const { t } = useTranslation();
  const { contracts } = useContractStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">{t('contracts.list')}</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{contract.clientName}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('contracts.initialDate')}: {new Date(contract.initialDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onAddRenewal(contract.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
              >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="mt-4 space-y-2">
              {contract.renewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(renewal.startDate).toLocaleDateString()} - 
                      {new Date(renewal.endDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(Number(renewal.annualValue))}
                      </span>
                      <button
                        onClick={() => onEditRenewal(contract.id, renewal)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  {renewal.notes && (
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{renewal.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractList;