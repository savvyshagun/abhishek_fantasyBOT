const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-tg-hint/10 flex items-center justify-center mb-4">
          <Icon size={40} className="text-tg-hint" />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-tg-hint mb-6 max-w-sm">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;
