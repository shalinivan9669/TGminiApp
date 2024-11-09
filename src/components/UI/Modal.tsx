// src/components/UI/Modal.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  // Обработчик закрытия по нажатию на Overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Обработчик закрытия по клавише Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 w-full h-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/3 max-h-full rounded-lg shadow-lg overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
