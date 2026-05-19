import React from 'react';
import { useSidebar } from '../context/SidebarContext';

const Topbar = ({ title = 'Dashboard' }) => {
  const { collapsed, toggle } = useSidebar();
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggle} aria-label="Toggle sidebar" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {collapsed ? (
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-sm text-gray-600">Hello, Admin</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
