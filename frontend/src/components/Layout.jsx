import React from 'react';
import Sidebar from './Sidebar';
// Layout component to wrap the main content with a sidebar
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
// Export the Layout component for use in other parts of the application
export default Layout;
