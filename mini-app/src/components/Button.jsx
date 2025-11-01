import { useTelegram } from '../hooks/useTelegram';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
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

  const baseStyles = 'font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-tg-button text-tg-button-text hover:opacity-90',
    secondary: 'bg-tg-secondary-bg text-tg-text border-2 border-tg-hint/20 hover:border-tg-hint/40',
    outline: 'bg-transparent text-tg-button border-2 border-tg-button hover:bg-tg-button/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
