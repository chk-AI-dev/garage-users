import React, { createContext, useContext, useEffect, useState } from 'react';
// Sidebar context for managing sidebar collapsed state
const SidebarContext = createContext();

const STORAGE_KEY = 'sidebarCollapsed';
// SidebarProvider component to provide sidebar context to children
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
  // Toggle function to switch between collapsed and expanded states
  const toggle = () => setCollapsed((v) => !v);
  // Provide the context value to children
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};
// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
