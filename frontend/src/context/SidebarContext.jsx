import React, { createContext, useContext, useEffect, useState } from 'react';
// Sidebar context for managing sidebar state
const SidebarContext = createContext();

const STORAGE_KEY = 'sidebarCollapsed';
// Provider component for wrapping the application with sidebar context
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : false;
    } catch (e) {
      return false;

    }
  });

  // useeffect hook for changes in collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch (e) {}
  }, [collapsed]);

  const toggle = () => setCollapsed((v) => !v);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
