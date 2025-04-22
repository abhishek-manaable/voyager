import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Award, ExternalLink, Edit2 } from 'lucide-react';
import { EmployeeProfile } from '../../../../../types/hr';
import CertificationModal from './modals/CertificationModal';

interface CertificationsInfoProps {
  employee: EmployeeProfile;
}

const CertificationsInfo: React.FC<CertificationsInfoProps> = ({ employee }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<{
    name: string;
    acquiredDate: Date;
    expiryDate?: Date;
    verificationUrl?: string;
  } | null>(null);

  const handleAddCertification = () => {
    setSelectedCertification(null);
    setIsModalOpen(true);
  };

  const handleEditCertification = (certification: typeof selectedCertification) => {
    setSelectedCertification(certification);
    setIsModalOpen(true);
  };

  const validCertifications = employee.certifications.filter(
    cert => !cert.expiryDate || cert.expiryDate > new Date()
  );

  const expiredCertifications = employee.certifications.filter(
    cert => cert.expiryDate && cert.expiryDate <= new Date()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Certifications
        </h3>
        <button
          onClick={handleAddCertification}
          className="flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Certification
        </button>
      </div>

      {/* Valid Certifications */}
      {validCertifications.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Valid Certifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validCertifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {cert.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Acquired: {cert.acquiredDate.toLocaleDateString()}
                      </p>
                      {cert.expiryDate && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Expires: {cert.expiryDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEditCertification(cert)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired Certifications */}
      {expiredCertifications.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Expired Certifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiredCertifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 opacity-60"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {cert.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Acquired: {cert.acquiredDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-red-500">
                        Expired: {cert.expiryDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEditCertification(cert)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <CertificationModal
          employeeId={employee.id}
          certification={selectedCertification}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCertification(null);
          }}
        />
      )}
    </div>
  );
};

export default CertificationsInfo;