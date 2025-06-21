import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default', // 'small', 'default', 'large', 'fullscreen'
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  contentClassName = '',
  backdropClassName = ''
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    small: 'max-w-md',
    default: 'max-w-2xl',
    large: 'max-w-4xl',
    fullscreen: 'w-full h-full max-w-none max-h-none rounded-none'
  };

  const heightClasses = {
    small: 'max-h-[70vh]',
    default: 'max-h-[90vh]',
    large: 'max-h-[90vh]',
    fullscreen: 'h-full'
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          bg-white rounded-xl shadow-2xl w-full overflow-hidden
          ${sizeClasses[size]} 
          ${heightClasses[size]}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between p-4 md:p-6 border-b border-gray-200 ${headerClassName}`}>
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-text-color">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Close"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${size === 'fullscreen' ? 'flex-1' : ''} ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;