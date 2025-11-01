const Card = ({ children, className = '', onClick, gradient = false, glow = false, ...props }) => {
  const baseStyles = "rounded-2xl p-4 transition-all duration-300";
  const interactiveStyles = onClick ? 'cursor-pointer card-hover' : '';
  const backgroundStyles = gradient
    ? 'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70'
    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm';
  const shadowStyles = glow ? 'shadow-glow' : 'shadow-soft hover:shadow-elevated';

  return (
    <div
      className={`${baseStyles} ${backgroundStyles} ${shadowStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
