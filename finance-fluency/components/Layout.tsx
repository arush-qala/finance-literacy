import React, { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Determine header title based on route
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/module/')) return `Module Learning`; 
    if (path === '/glossary') return 'Financial Glossary';
    if (path === '/settings') return 'Settings';
    return 'Finance Fluency';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onCloseMobile={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen transition-all duration-300">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{getHeaderTitle()}</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};