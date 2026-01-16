import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Download, Info, AlertTriangle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { data, updateUserName, resetProgress } = useApp();
  const [tempName, setTempName] = useState(data?.user.name || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  React.useEffect(() => {
    if(data) setTempName(data.user.name);
  }, [data]);

  const handleExport = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `finance_fluency_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
      resetProgress();
      setShowResetConfirm(false);
      setTempName('Guest');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>

        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                Profile Settings
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <button 
                            onClick={() => updateUserName(tempName)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Data Management</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                        <h4 className="font-medium text-slate-800">Export Progress</h4>
                        <p className="text-sm text-slate-500">Download your learning data as a JSON file.</p>
                    </div>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                    <div>
                        <h4 className="font-medium text-red-800">Reset Progress</h4>
                        <p className="text-sm text-red-600">Permanently delete all progress and start over.</p>
                    </div>
                    {!showResetConfirm ? (
                        <button 
                            onClick={() => setShowResetConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                        >
                            <Trash2 size={16} /> Reset
                        </button>
                    ) : (
                         <div className="flex gap-2">
                            <button 
                                onClick={() => setShowResetConfirm(false)}
                                className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReset}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Info size={20} className="text-indigo-500" /> About
            </h3>
            <div className="text-slate-600 space-y-2">
                <p><strong>Finance Fluency</strong> v1.0.0</p>
                <p>An interactive training application designed to help data analysts and non-finance professionals master accounting essentials.</p>
                <p className="text-sm text-slate-400 mt-4">© 2025 Finance Fluency. All rights reserved.</p>
            </div>
        </div>
    </div>
  );
};