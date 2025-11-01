const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`bg-tg-secondary-bg rounded-xl p-4 shadow-sm ${
        onClick ? 'cursor-pointer active:scale-98 transition-transform' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
