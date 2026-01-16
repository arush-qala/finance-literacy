import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Lock, Clock, CheckCircle2, BarChart3, ArrowRight, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOTAL_MODULES, ModuleProgress } from '../types';
import { Certificate } from '../components/Certificate';
import { UserModal } from '../components/UserModal';

export const Dashboard: React.FC = () => {
  const { data, updateUserName } = useApp();
  const navigate = useNavigate();
  const [showCertificate, setShowCertificate] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (data && data.user.name === 'Guest') {
      setShowWelcomeModal(true);
    }
  }, [data]);

  if (!data) return null;

  const isModuleLocked = (id: number) => {
    if (id === 1) return false;
    return !data.progress[(id - 1).toString()]?.completed;
  };

  const getButtonState = (id: number, locked: boolean) => {
    if (locked) {
      return (
        <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Lock size={14} />
          <span>Locked</span>
        </div>
      );
    }
    const isCompleted = data.progress[id.toString()]?.completed;
    return (
      <button 
        onClick={() => navigate(`/module/${id}`)}
        className={`mt-4 group flex items-center gap-2 text-sm font-semibold transition-colors
          ${isCompleted 
            ? 'text-emerald-600 hover:text-emerald-700' 
            : 'text-indigo-600 hover:text-indigo-700'
          }
        `}
      >
        <span>{isCompleted ? 'Review Module' : 'Start Module'}</span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    );
  };

  const completedCount = Object.values(data.progress).filter((p: ModuleProgress) => p.completed).length;
  const allCompleted = completedCount === TOTAL_MODULES;

  // Calculate average score
  const quizScores = Object.values(data.progress)
    .map((p: ModuleProgress) => p.quizScore)
    .filter((s): s is number => s !== null);
  const averageScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) 
    : 0;

  if (showCertificate) {
    return (
      <>
        <button 
          onClick={() => setShowCertificate(false)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"
        >
          <ArrowRight className="rotate-180" size={20} /> Back to Dashboard
        </button>
        <Certificate 
          userName={data.user.name} 
          completionDate={new Date().toLocaleDateString()}
          averageScore={averageScore}
        />
      </>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <UserModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        currentName=""
        onSave={updateUserName}
      />

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back, {data.user.name}</h1>
           <p className="text-slate-500 max-w-2xl">
            {allCompleted 
              ? "You've completed the entire curriculum! View your certificate below." 
              : "Continue your journey to mastering financial concepts. You're making great progress."}
           </p>
        </div>
        {allCompleted && (
          <button 
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Award size={20} />
            View Certificate
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-md text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Progress</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{completedCount} <span className="text-lg text-slate-400 font-normal">/ {TOTAL_MODULES}</span></p>
            <p className="text-sm text-slate-500 mt-1">Modules completed</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 rounded-md text-blue-600">
              <BarChart3 size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Performance</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{averageScore} <span className="text-lg text-slate-400 font-normal">%</span></p>
            <p className="text-sm text-slate-500 mt-1">Average quiz score</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-amber-50 rounded-md text-amber-600">
              <Clock size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Time Spent</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{data.stats.totalTimeSpent} <span className="text-lg text-slate-400 font-normal">min</span></p>
            <p className="text-sm text-slate-500 mt-1">Total learning time</p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          Curriculum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: TOTAL_MODULES }, (_, i) => i + 1).map((id) => {
            const locked = isModuleLocked(id);
            const isCompleted = data.progress[id.toString()]?.completed;

            let title = `Module ${id}`;
            let desc = "";
            let time = "20-25m";
            
            switch(id) {
                case 1: title = 'The Language of Business'; desc = 'Master accounting fundamentals and the core equations.'; break;
                case 2: title = 'Reading Financial Statements'; desc = 'Interpret Balance Sheets, Income Statements, and Cash Flow.'; break;
                case 3: title = 'Revenue Recognition'; desc = 'Deep dive into IFRS 15/ASC 606 principles.'; break;
                case 4: title = 'Assets & Depreciation'; desc = 'Recording and expensing long-term assets.'; break;
                case 5: title = 'Cash Flow Statements'; desc = 'Following the money and understanding liquidity.'; break;
                case 6: title = 'Liabilities & Provisions'; desc = 'Understanding obligations, provisions, and contingencies.'; time="20m"; break;
                case 7: title = 'Cost Behavior Analysis'; desc = 'Fixed vs variable costs and break-even analysis.'; time="25m"; break;
                case 8: title = 'Customer Profitability'; desc = 'Activity-based costing and whale curves.'; time="25m"; break;
                case 9: title = 'Performance Measurement'; desc = 'Budget vs actual analysis and variance types.'; time="25m"; break;
                case 10: title = 'B2B Finance in Practice'; desc = 'Final comprehensive assessment and real-world application.'; time="30m"; break;
            }

            return (
              <div 
                key={id} 
                className={`
                  bg-white rounded-lg p-6 border transition-all duration-300 flex flex-col h-full
                  ${locked 
                    ? 'border-slate-100 bg-slate-50/50 opacity-75' 
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`
                    text-xs font-bold px-2 py-1 rounded border
                    ${isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : locked 
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }
                  `}>
                    MODULE {id}
                  </span>
                  {!locked && (
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock size={12} />
                      <span>{time}</span>
                    </div>
                  )}
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${locked ? 'text-slate-400' : 'text-slate-900'}`}>
                  {title}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">
                   {desc}
                </p>

                <div className="pt-4 border-t border-slate-50 mt-auto">
                    {getButtonState(id, locked)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};