import React, { useContext } from 'react';
import { Page } from '../../interfaces/Page';
import { AuthContext } from '../../context/AuthContext';

interface DeletePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  onDelete: (pageId: number) => Promise<void>;
  isDeleting?: boolean;
  userRole?: string;
}

export const DeletePageModal: React.FC<DeletePageModalProps> = ({
  isOpen,
  onClose,
  page,
  onDelete,
  isDeleting = false,
  userRole,
}) => {
  const { user } = useContext(AuthContext);
  if (!isOpen || !page) return null;

  const canDelete = user?.role === 'admin' || user?.role === 'editor';

  const handleDelete = async () => {
    if (!canDelete) {
      console.error('Недостатньо прав для видалення сторінки');
      return;
    }

    try {
      await onDelete(page.id);
      onClose();
    } catch (error) {
      console.error('Помилка при видаленні сторінки:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 ease-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Підтвердження видалення сторінки
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
        <div className="p-6">
          <div className="text-gray-300 mb-6">
            <p className="mb-3">
              Ви впевнені, що хочете видалити сторінку?
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Деталі сторінки:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-400">Назва:</span>{' '}
                  <span className="text-white">{page.title}</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-red-300 text-sm">
              <strong>Попередження:</strong> Ця дія є незворотною.
            </p>
            {!canDelete && (
              <p className="mt-2 text-red-400 text-sm font-medium">
                ❌ У вас недостатньо прав для видалення сторінки. Потрібна роль адміністратора або редактора.
              </p>
            )}
          </div>
        </div>
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
                <span>Видалення...</span>
              </>
            ) : (
              <>
                <span className="text-base">🗑️</span>
                <span>Видалити</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};