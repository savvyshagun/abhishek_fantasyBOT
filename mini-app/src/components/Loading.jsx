const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tg-bg">
      <div className="w-12 h-12 border-4 border-tg-button border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-tg-hint">{message}</p>
    </div>
  );
};

export default Loading;
