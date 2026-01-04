
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-teal-400"
          >
            <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.933l-9 5.25v9.317l9-5.25V7.933zM2.25 7.933v9.317l9 5.25v-9.317l-9-5.25z" />
          </svg>
          <span className="text-2xl font-bold text-white">Deal.ai</span>
        </div>
      </nav>
    </header>
  );
};
