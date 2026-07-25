import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
// working on side bar component with tailwind css, using NavLink for active state and icons from heroicons
const Sidebar = () => {
  const { collapsed } = useSidebar();
  return (
    <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen ${collapsed ? 'w-20' : 'w-64'} transition-[width] duration-200`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 flex items-center gap-3 border-b dark:border-gray-800">
          <div className="bg-indigo-600 text-white rounded p-2">GU</div>
          <div className={`text-lg font-semibold ${collapsed ? 'hidden' : 'block'}`}>Garage Users</div>
        </div>
        
        <nav className="flex-1 overflow-auto px-2 py-4">
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18"/></svg>
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Dashboard</span>
          </NavLink>

          <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-2.21-1.79-4-4-4S4 8.79 4 11s1.79 4 4 4 4-1.79 4-4zM12 11v10"/></svg>
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Admin</span>
          </NavLink>

          <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM4 20c0-3.3 4-5 8-5s8 1.7 8 5v1H4v-1z" fill="currentColor"/></svg>
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Users</span>
          </NavLink>

          <NavLink to="/admin/equipment" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24"><path d="M3 6h18v12H3z" fill="currentColor"/></svg>
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Equipment</span>
          </NavLink>

        </nav>

        <div className="px-4 py-4 border-t dark:border-gray-800">
          <button className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
