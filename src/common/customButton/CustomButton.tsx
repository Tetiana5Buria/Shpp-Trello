import React from 'react';
import './customButton.scss';

interface CustomButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = 'button',
  disabled = false,
  loading = false,
  children,
  onClick,
  className,
}) => {
  return (
    <button className={className} type={type} disabled={disabled || loading} onClick={onClick}>
      {loading ? 'Зачекайте...' : children}
    </button>
  );
};

export default CustomButton;
