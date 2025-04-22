import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useContractStore } from '../../../store/contracts';
import { ContractFormData, ContractRenewal } from '../../../types/contract';

interface ContractFormProps {
  contractId?: string | null;
  renewal?: ContractRenewal;
  onClose: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ contractId, renewal, onClose }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<ContractFormData>({
    defaultValues: {
      clientName: renewal?.clientName || '',
      startDate: renewal?.startDate || '',
      endDate: renewal?.endDate || '',
      annualValue: renewal?.annualValue || 0,
      notes: renewal?.notes || ''
    }
  });
  const { addContract, addRenewal, updateRenewal } = useContractStore();

  const onSubmit = async (data: ContractFormData) => {
    try {
      if (renewal?.id) {
        // 既存の更新を編集
        await updateRenewal(contractId!, renewal.id, {
          startDate: data.startDate,
          endDate: data.endDate,
          annualValue: Number(data.annualValue),
          status: 'active',
          notes: data.notes,
        });
      } else if (contractId) {
        // 新規更新を追加
        await addRenewal(contractId, {
          id: '',
          startDate: data.startDate,
          endDate: data.endDate,
          annualValue: Number(data.annualValue),
          status: 'active',
          notes: data.notes,
        });
      } else {
        // 新規契約を作成
        await addContract(data.clientName, data.startDate, {
          id: '',
          startDate: data.startDate,
          endDate: data.endDate,
          annualValue: Number(data.annualValue),
          status: 'active',
          notes: data.notes,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {renewal?.id ? t('contracts.edit') : contractId ? t('contracts.renewal') : t('contracts.new')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!contractId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contracts.form.clientName')}
          </label>
          <input
            {...register('clientName', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.clientName && (
            <p className="text-red-500 text-sm mt-1">{t('contracts.form.required')}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contracts.form.startDate')}
          </label>
          <input
            type="date"
            {...register('startDate', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{t('contracts.form.required')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contracts.form.endDate')}
          </label>
          <input
            type="date"
            {...register('endDate', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{t('contracts.form.required')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('contracts.form.annualValue')}
        </label>
        <input
          type="number"
          {...register('annualValue', { required: true, min: 0 })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.annualValue && (
          <p className="text-red-500 text-sm mt-1">{t('contracts.form.invalidValue')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('contracts.form.notes')}
        </label>
        <textarea
          {...register('notes')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
        >
          {t('contracts.form.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {t('contracts.form.save')}
        </button>
      </div>
    </form>
  );
};

export default ContractForm;