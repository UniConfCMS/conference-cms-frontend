import React from 'react';
import { Conference } from '../../interfaces/Conference';

interface DeleteConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  conference: Conference | null;
  onDelete: (conferenceId: number) => Promise<void>;
  isDeleting?: boolean;
  userRole?: string; // Додано для перевірки ролі
}

export const DeleteConferenceModal: React.FC<DeleteConferenceModalProps> = ({ 
  isOpen, 
  onClose, 
  conference, 
  onDelete, 
  isDeleting = false,
  userRole 
}) => {
  if (!isOpen || !conference) return null;

  // Перевірка прав доступу
  const canDelete = userRole === 'admin';

  const handleDelete = async () => {
    if (!canDelete) {
      console.error('Insufficient permissions to delete conference');
      return;
    }
    
    try {
      await onDelete(conference.id);
      onClose();
    } catch (error) {
      console.error('Error when deleting a conference:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
            Confirmation of deletion
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl leading-none"
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-gray-300 mb-6">
            <p className="mb-3">
            Are you sure you want to delete the conference?
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Conference details:Attention</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Title:</span> <span className="text-white">{conference.title}</span></p>
                <p><span className="text-gray-400">Year:</span> <span className="text-white">{conference.year}</span></p>
              </div>
            </div>
            <p className="mt-4 text-red-300 text-sm">
              <strong>Warning:</strong> This action is irreversible. All associated data will also be deleted.
            </p>
            {!canDelete && (
              <p className="mt-2 text-red-400 text-sm font-medium">
                ❌ You do not have sufficient permissions to delete conferences. You need an administrator role.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition-colors duration-200"
            disabled={isDeleting}
          >
            Скасувати
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !canDelete}
            className={`px-4 py-2 text-sm font-medium text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              canDelete 
                ? 'bg-red-600 border-red-500 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-gray-600 border-gray-500 cursor-not-allowed'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Removal...</span>
              </>
            ) : (
              <>
                <span className="text-base">🗑️</span>
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};