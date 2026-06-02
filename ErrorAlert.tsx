/**
 * Error Alert Component
 * Status: Production-ready
 */

import { X } from 'lucide-react';

interface ErrorAlertProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-40 max-w-md animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-red-500 hover:text-red-700 transition"
          aria-label="Close error"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
