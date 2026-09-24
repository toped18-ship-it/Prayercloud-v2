import React, { useEffect, useState } from 'react';

export const GoogleMapsQuotaBanner: React.FC = () => {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  if (!quotaExceeded) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 backdrop-blur-md flex items-center justify-between gap-4">
      <div className="flex-1 text-center">
        <span>
          Google Maps Platform quota reached. If you are the app owner, visit{' '}
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-amber-300 hover:text-amber-100"
          >
            maps developer site
          </a>{' '}
          for instructions to update your account.
        </span>
      </div>
      <button
        onClick={() => setQuotaExceeded(false)}
        className="text-amber-400 hover:text-white px-2 py-0.5 rounded text-xs font-bold"
      >
        ✕
      </button>
    </div>
  );
};
