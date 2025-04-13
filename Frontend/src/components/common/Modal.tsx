import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-40"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <div className={`modal-box ${sizeClass[size]} w-full p-0 bg-white rounded-lg shadow-xl transform transition-all`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="p-4 border-t">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;