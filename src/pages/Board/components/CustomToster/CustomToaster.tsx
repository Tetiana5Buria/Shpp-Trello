import React from 'react';
import { Toaster } from 'sonner';

const CustomToaster: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          backgroundColor: '#4b4c45',
          color: '#dbe42a',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          fontSize: '16px',
        },
      }}
    />
  );
};

export default CustomToaster;
