import React from 'react';
import Sidebar from './Sidebar';
// Layout component for consistent page structure
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
