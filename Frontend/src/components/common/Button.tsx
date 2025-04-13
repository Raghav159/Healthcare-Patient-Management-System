import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn focus:outline-none';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
    ghost: 'btn-ghost',
    link: 'btn-link',
  };
  
  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    isLoading ? 'loading' : '',
    className,
  ].join(' ');
  
  return (
    <button 
      className={classes} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;