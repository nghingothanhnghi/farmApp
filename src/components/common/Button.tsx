import React from 'react';

interface ButtonProps {
  label?: string;
  onClick?: () => void;
    onMouseEnter?: () => void; // ✅ add this
  onMouseLeave?: () => void; // ✅ add this
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  size = 'md',
}) => {
  const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none transition-colors gap-2';

  const sizeStyles = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',     // default
    lg: 'text-lg px-5 py-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    link: 'bg-transparent text-blue-600 hover:underline p-0', 
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const iconOnlyStyles = iconOnly ? 'p-2 w-10 h-10 justify-center items-center gap-0 rounded-full' : '';
  const sizeClass = variant === 'link' ? 'text-sm' : sizeStyles[size];


  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeClass} ${widthStyles} ${disabledStyles} ${iconOnlyStyles} ${className}`}
      onClick={onClick}
        onMouseEnter={onMouseEnter}
  onMouseLeave={onMouseLeave}
      disabled={disabled}
      title={iconOnly && typeof label === 'string' ? label : undefined}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {!iconOnly && label}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

export default Button;