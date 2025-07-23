import React from 'react';

type BadgeProps = {
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  children?: React.ReactNode;
};

const variantClasses = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-cyan-100 text-cyan-800',
  gray: 'bg-gray-100 text-gray-800',
};

const sizeClasses = {
  small: 'text-xs px-2 py-0.5',
  medium: 'text-sm px-3 py-1',
  large: 'text-base px-4 py-1.5',
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'gray',
  size = 'small',
  className = '',
  children,
}) => {
  const variantClass = variantClasses[variant] || variantClasses.gray;
  const sizeClass = sizeClasses[size] || sizeClasses.small;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass} ${className}`}
    >
      {children || label}
    </span>
  );
};

export default Badge;
