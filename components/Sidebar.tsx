import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, CheckCircle, Circle, User, LayoutDashboard, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { useApp } from '../context/AppContext';
import { TOTAL_MODULES, ModuleProgress } from '../types';
import { UserModal } from './UserModal';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { data, updateUserName } = useApp();
  const location = useLocation();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Calculate completion percentage
  const completedCount = data ? Object.values(data.progress).filter((p: ModuleProgress) => p.completed).length : 0;
  const progressPercentage = Math.round((completedCount / TOTAL_MODULES) * 100);

  const isModuleLocked = (id: number) => {
    if (id === 1) return false;
    // Locked if previous module is not completed
    return !data?.progress[(id - 1).toString()]?.completed;
  };

  const getModuleStatusIcon = (id: number) => {
    if (isModuleLocked(id)) return <Lock size={14} className="text-slate-600" />;
    
    if (data?.progress[id.toString()]?.completed) {
      return <CheckCircle size={14} className="text-emerald-500" />;
    }
    
    // Check if in progress
    if ((data?.progress[id.toString()]?.conceptsRead.length || 0) > 0) {
       return <Circle size={14} className="text-amber-500 fill-amber-500/20" />;
    }

    return <Circle size={14} className="text-slate-700" />;
  };

  const sidebarClasses = `
    fixed top-0 left-0 h-full w-[260px] bg-slate-900 border-r border-slate-800 
    transform transition-transform duration-300 ease-in-out z-40
    flex flex-col text-slate-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `;

  return (
    <>
      <aside className={sidebarClasses}>
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white">
            <GraduationCap size={18} />
          </div>
          <span className="font-bold text-white tracking-tight">Finance Fluency</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {/* Progress Section */}
          <div className="mb-8 flex flex-col items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
             <ProgressRing radius={40} stroke={5} progress={progressPercentage} color="text-indigo-500" trackColor="text-slate-700" textColor="text-slate-200" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Platform</h3>
              <div className="space-y-1">
                <NavLink 
                  to="/dashboard" 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/glossary" 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <BookOpen size={18} />
                  Glossary
                </NavLink>
                 <NavLink 
                  to="/settings" 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <SettingsIcon size={18} />
                  Settings
                </NavLink>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Curriculum</h3>
              <div className="space-y-0.5">
                {Array.from({ length: TOTAL_MODULES }, (_, i) => i + 1).map((id) => {
                  const locked = isModuleLocked(id);
                  const isActive = location.pathname === `/module/${id}`;
                  
                  return (
                    <NavLink
                      key={id}
                      to={locked ? '#' : `/module/${id}`}
                      onClick={(e) => {
                        if (locked) e.preventDefault();
                        else onCloseMobile();
                      }}
                      className={`
                        group flex items-center justify-between px-3 py-2 rounded-md transition-all text-sm font-medium
                        ${isActive && !locked ? 'bg-slate-800 text-white border-l-2 border-indigo-500' : ''}
                        ${!isActive && !locked ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : ''}
                        ${locked ? 'text-slate-600 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className={`text-xs w-5 text-right ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                          {id.toString().padStart(2, '0')}
                        </span>
                        <span className="truncate">Module {id}</span>
                      </div>
                      <div className="ml-2 shrink-0">
                        {getModuleStatusIcon(id)}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{data?.user.name}</p>
              <p className="text-xs text-slate-500">View Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <UserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        currentName={data?.user.name || 'Guest'} 
        onSave={updateUserName}
      />
    </>
  );
};