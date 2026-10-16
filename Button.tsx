import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'amber' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vsBg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const sizeStyles = {
    sm: 'min-h-[38px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm gap-2',
    lg: 'min-h-[50px] px-6 py-3 text-base gap-2.5 font-semibold',
  };
  const variantStyles = {
    primary:
      'bg-vsBlue text-white hover:bg-blue-600 focus:ring-vsBlue shadow-lg shadow-vsBlue/20 active:scale-[0.98]',
    danger:
      'bg-vsCoral text-white hover:bg-red-600 focus:ring-vsCoral shadow-lg shadow-vsCoral/20 active:scale-[0.98]',
    success:
      'bg-vsGreen text-vsBg font-bold hover:bg-emerald-400 focus:ring-vsGreen shadow-lg shadow-vsGreen/20 active:scale-[0.98]',
    amber:
      'bg-vsAmber text-vsBg font-bold hover:bg-amber-400 focus:ring-vsAmber shadow-lg shadow-vsAmber/20 active:scale-[0.98]',
    outline:
      'border border-white/15 bg-vsNavy/60 text-vsText hover:bg-vsNavy hover:border-vsBlue/50 focus:ring-vsBlue',
    ghost:
      'text-vsMuted hover:text-vsText hover:bg-white/5 focus:ring-white/20',
  };
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
