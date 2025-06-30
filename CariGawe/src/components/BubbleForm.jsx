import { useEffect } from "react";

function BubbleForm({ errorStatus, message, status }) {
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        errorStatus();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorStatus]);

  const colorClass =
    status === 'success'
      ? 'from-emerald-900 to-emerald-400'
      : 'from-red-900 to-red-400';

  return (
    <div className={`absolute z-20 top-20 px-6 py-3 rounded-lg shadow-lg bg-gradient-to-r ${colorClass} text-white animate-fade-in transition-opacity duration-300`}>
      <span className="font-montserrat font-semibold">{message}</span>
    </div>
  );
}

export default BubbleForm;
