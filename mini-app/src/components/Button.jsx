import { useTelegram } from '../hooks/useTelegram';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const { hapticFeedback } = useTelegram();

  const handleClick = (e) => {
    if (!disabled) {
      hapticFeedback('light');
      onClick?.(e);
    }
  };

  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md';

  const variantStyles = {
    primary: 'gradient-primary text-white hover:shadow-glow',
    secondary: 'gradient-secondary text-white hover:shadow-glow-blue',
    accent: 'gradient-accent text-white',
    outline: 'bg-transparent text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
