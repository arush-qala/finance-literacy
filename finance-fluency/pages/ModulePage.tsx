import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, PenTool, BrainCircuit, CheckCircle2, Circle, AlertCircle, ArrowRight, HelpCircle, Lightbulb, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOTAL_MODULES } from '../types';
import { getModuleContent, ModuleContent, Transaction } from '../data/moduleContent';
import { storageService } from '../services/storageService';

export const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const moduleId = parseInt(id || '1', 10);
  const { data, refreshData, markModuleComplete } = useApp();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'quiz'>('learn');
  const [content, setContent] = useState<ModuleContent | null>(null);

  // States for Learn Tab
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  // States for Practice Tab (Transactions)
  const [currentTransactionIdx, setCurrentTransactionIdx] = useState(0);
  const [maxTransactionReached, setMaxTransactionReached] = useState(0); // Track furthest progress
  const [transactionInputs, setTransactionInputs] = useState<Record<string, string>>({});
  const [transactionFeedback, setTransactionFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  
  // Hint/Solution states for Transactions
  const [showTransactionHint, setShowTransactionHint] = useState(false);
  const [showTransactionSolution, setShowTransactionSolution] = useState(false);
  
  // States for Practice Tab (Analysis)
  const [analysisAnswers, setAnalysisAnswers] = useState<Record<string, string>>({}); // questionId -> answer
  const [analysisFeedback, setAnalysisFeedback] = useState<Record<string, { isCorrect: boolean; message: string }>>({});
  const [revealedAnalysisHints, setRevealedAnalysisHints] = useState<Record<string, boolean>>({});
  const [revealedAnalysisSolutions, setRevealedAnalysisSolutions] = useState<Record<string, boolean>>({});

  const [practiceFinished, setPracticeFinished] = useState(false);

  // States for Quiz Tab
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // Load content
    const c = getModuleContent(moduleId);
    setContent(c);
    if (c) {
      setExpandedConcept(c.concepts[0].id);
    }
    
    // Reset local states when module ID changes
    setActiveTab('learn');
    setCurrentTransactionIdx(0);
    setMaxTransactionReached(0);
    setPracticeFinished(false);
    setTransactionInputs({});
    setTransactionFeedback(null);
    setShowTransactionHint(false);
    setShowTransactionSolution(false);
    setAnalysisAnswers({});
    setAnalysisFeedback({});
    setRevealedAnalysisHints({});
    setRevealedAnalysisSolutions({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [moduleId]);

  // Check completion criteria on every relevant update
  useEffect(() => {
    if (!data || !content) return;

    const moduleProgress = data.progress[moduleId.toString()];
    const allConceptsRead = content.concepts.every(c => moduleProgress.conceptsRead.includes(c.id));
    const exerciseDone = moduleProgress.exerciseCompleted;
    const quizPassed = (moduleProgress.quizScore || 0) >= 70;

    if (allConceptsRead && exerciseDone && quizPassed && !moduleProgress.completed) {
      markModuleComplete(moduleId);
    }
  }, [data, content, moduleId, markModuleComplete]);

  // Calculate balances dynamically based on current index
  const currentBalances = useMemo(() => {
    if (!content || content.practice.type !== 'transaction-simulation') return {};
    
    const balances = { ...content.practice.startingBalances };
    
    // Apply changes from all previous transactions (0 to currentTransactionIdx - 1)
    for (let i = 0; i < currentTransactionIdx; i++) {
        const tx = content.practice.transactions[i];
        for (const [account, change] of Object.entries(tx.correctChanges)) {
            balances[account] = (balances[account] || 0) + change;
        }
    }
    return balances;
  }, [content, currentTransactionIdx]);

  if (isNaN(moduleId) || moduleId < 1 || moduleId > TOTAL_MODULES) {
    return <div className="p-8 text-center">Module not found</div>;
  }

  // Handle non-implemented modules
  if (!content) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="mb-6 inline-flex p-4 bg-slate-100 rounded-full">
            <BookOpen size={48} className="text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Module {moduleId}</h1>
        <p className="text-slate-500 mb-8">Content coming soon for this module.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const moduleProgress = data?.progress[moduleId.toString()];
  const isConceptRead = (id: string) => moduleProgress?.conceptsRead.includes(id);

  const toggleConceptRead = (conceptId: string) => {
    if (!moduleProgress) return;
    const currentRead = moduleProgress.conceptsRead;
    let newRead;
    if (currentRead.includes(conceptId)) {
      newRead = currentRead.filter(id => id !== conceptId);
    } else {
      newRead = [...currentRead, conceptId];
    }
    storageService.updateProgress(moduleId.toString(), { conceptsRead: newRead });
    refreshData();
  };

  // --- Transaction Logic ---
  const handleTransactionCheck = (transaction: Transaction) => {
    let allCorrect = true;
    for (const [account, change] of Object.entries(transaction.correctChanges)) {
      const userVal = parseInt(transactionInputs[account] || '0', 10);
      if (userVal !== change) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setTransactionFeedback({ isCorrect: true, message: "Correct! " + transaction.explanation });
      setMaxTransactionReached(prev => Math.max(prev, currentTransactionIdx + 1));
      // Balances update automatically via useMemo when index changes later
    } else {
      setTransactionFeedback({ isCorrect: false, message: "Not quite. Check your calculations and try again." });
    }
  };

  const revealTransactionSolution = (transaction: Transaction) => {
    // Fill inputs with correct values
    const correctInputs: Record<string, string> = {};
    for (const [account, change] of Object.entries(transaction.correctChanges)) {
        correctInputs[account] = change.toString();
    }
    // Also fill any inputs that should be 0 but were in the list
    transaction.inputs.forEach(input => {
        if (!correctInputs[input]) correctInputs[input] = "0";
    });

    setTransactionInputs(correctInputs);
    setTransactionFeedback({ isCorrect: true, message: "Solution revealed: " + transaction.explanation });
    setShowTransactionSolution(true);
    setMaxTransactionReached(prev => Math.max(prev, currentTransactionIdx + 1));
  };

  const nextTransaction = () => {
    if (!content || content.practice.type !== 'transaction-simulation') return;
    
    if (currentTransactionIdx < content.practice.transactions.length - 1) {
      const nextIdx = currentTransactionIdx + 1;
      setCurrentTransactionIdx(nextIdx);
      
      // If we've already reached this point or further, show it as completed or ready to solve
      // If we are browsing back to a completed one, we should pre-fill it.
      if (nextIdx < maxTransactionReached) {
          const tx = content.practice.transactions[nextIdx];
          const correctInputs: Record<string, string> = {};
          for (const [account, change] of Object.entries(tx.correctChanges)) {
             correctInputs[account] = change.toString();
          }
          tx.inputs.forEach(input => {
             if (!correctInputs[input]) correctInputs[input] = "0";
          });
          setTransactionInputs(correctInputs);
          setTransactionFeedback({ isCorrect: true, message: "Completed" });
          setShowTransactionHint(false);
          setShowTransactionSolution(false);
      } else {
          // New unsolved transaction
          setTransactionInputs({});
          setTransactionFeedback(null);
          setShowTransactionHint(false);
          setShowTransactionSolution(false);
      }
    } else {
      setPracticeFinished(true);
      storageService.updateProgress(moduleId.toString(), { exerciseCompleted: true });
      refreshData();
    }
  };

  const prevTransaction = () => {
      if (currentTransactionIdx > 0 && content?.practice.type === 'transaction-simulation') {
          const prevIdx = currentTransactionIdx - 1;
          setCurrentTransactionIdx(prevIdx);
          
          // Restore state for previous transaction (since we passed it, it's correct)
          const prevTx = content.practice.transactions[prevIdx];
          const correctInputs: Record<string, string> = {};
          for (const [account, change] of Object.entries(prevTx.correctChanges)) {
              correctInputs[account] = change.toString();
          }
          prevTx.inputs.forEach(input => {
              if (!correctInputs[input]) correctInputs[input] = "0";
          });
          setTransactionInputs(correctInputs);
          setTransactionFeedback({ isCorrect: true, message: "Completed" });
          setShowTransactionHint(false);
          setShowTransactionSolution(false);
      }
  };

  // --- Analysis Logic ---
  const checkAnalysisAnswer = (scenarioId: string, questionId: string, correctAnswer: string | number, explanation: string) => {
    const userVal = analysisAnswers[questionId];
    if (!userVal) return;

    let isCorrect = false;
    if (typeof correctAnswer === 'number') {
        // loose equality for string input vs number answer
        isCorrect = parseFloat(userVal) === correctAnswer; 
    } else {
        isCorrect = userVal.trim().toLowerCase() === correctAnswer.toString().toLowerCase();
    }

    setAnalysisFeedback(prev => ({
        ...prev,
        [questionId]: {
            isCorrect,
            message: isCorrect ? "Correct! " + explanation : "Incorrect. Try again."
        }
    }));

    // Check completion
    if (isCorrect && content?.practice.type === 'analysis') {
         const totalQuestions = content.practice.scenarios.reduce((acc, s) => acc + s.questions.length, 0);
         const correctQuestionIds = new Set(Object.keys(analysisFeedback).filter(k => analysisFeedback[k].isCorrect));
         if (isCorrect) {
            correctQuestionIds.add(questionId);
         }
         
         if (correctQuestionIds.size >= totalQuestions) {
             setPracticeFinished(true);
             storageService.updateProgress(moduleId.toString(), { exerciseCompleted: true });
             refreshData();
         }
    }
  };

  const revealAnalysisSolution = (questionId: string, correctAnswer: string | number, explanation: string) => {
      setAnalysisAnswers(prev => ({...prev, [questionId]: correctAnswer.toString()}));
      setAnalysisFeedback(prev => ({
          ...prev,
          [questionId]: {
              isCorrect: true,
              message: "Solution revealed: " + explanation
          }
      }));
      setRevealedAnalysisSolutions(prev => ({...prev, [questionId]: true}));
      
      // Check completion
      if (content?.practice.type === 'analysis') {
         const totalQuestions = content.practice.scenarios.reduce((acc, s) => acc + s.questions.length, 0);
         const correctQuestionIds = new Set(Object.keys(analysisFeedback).filter(k => analysisFeedback[k].isCorrect));
         correctQuestionIds.add(questionId);
         
         if (correctQuestionIds.size >= totalQuestions) {
             setPracticeFinished(true);
             storageService.updateProgress(moduleId.toString(), { exerciseCompleted: true });
             refreshData();
         }
      }
  };


  const submitQuiz = () => {
    let correct = 0;
    content.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / content.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Only update if score is better
    const currentScore = moduleProgress?.quizScore || 0;
    if (score > currentScore) {
      storageService.updateProgress(moduleId.toString(), { quizScore: score });
      refreshData();
    }
  };

  // --- RENDER HELPERS ---

  const renderLearnTab = () => (
    <div className="space-y-4 max-w-3xl mx-auto py-6">
      {content.concepts.map((concept, idx) => {
        const isExpanded = expandedConcept === concept.id;
        const read = isConceptRead(concept.id);

        return (
          <div key={concept.id} className={`bg-white rounded-lg border transition-all duration-300 ${isExpanded ? 'border-indigo-200 shadow-md' : 'border-slate-200 shadow-sm'}`}>
            <button 
              className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
              onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${read ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {read ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <h3 className={`font-semibold text-lg ${isExpanded ? 'text-indigo-900' : 'text-slate-800'}`}>{concept.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                 {read && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Read</span>}
              </div>
            </button>

            {isExpanded && (
              <div className="px-6 pb-6 pt-0 animate-fade-in border-t border-slate-50">
                <div className="mt-4 prose prose-slate max-w-none text-slate-600">
                    <p className="whitespace-pre-line leading-relaxed">{concept.explanation}</p>
                </div>
                
                {concept.table && (
                  <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          {concept.table.headers.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {concept.table.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            {row.map((cell, j) => <td key={j} className="px-4 py-3 text-slate-600">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {concept.visual && (
                  <div className="mt-6 bg-slate-900 text-indigo-200 p-5 rounded-lg font-mono text-xs md:text-sm whitespace-pre overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                    {concept.visual}
                  </div>
                )}

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                     <div className="flex-1 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
                            <BrainCircuit size={16} className="text-indigo-600" /> Key Takeaway
                        </h4>
                        <p className="text-indigo-800 text-sm">{concept.keyTakeaway}</p>
                    </div>

                    {concept.example && (
                    <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                        <h4 className="text-slate-800 font-bold text-sm mb-2 flex items-center gap-2">
                            <HelpCircle size={16} className="text-slate-500" /> Real World Example
                        </h4>
                        <p className="text-slate-600 text-sm italic">"{concept.example}"</p>
                    </div>
                    )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  {!read ? (
                    <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          toggleConceptRead(concept.id);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Mark as Read
                    </button>
                  ) : (
                      <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          toggleConceptRead(concept.id);
                      }}
                      className="px-4 py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
                    >
                      Unmark as Read
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPracticeTab = () => {
    if (practiceFinished) {
      return (
        <div className="max-w-xl mx-auto py-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Exercise Complete!</h2>
          <p className="text-slate-600 mb-8">You've successfully applied the concepts from this module.</p>
          <div className="flex justify-center gap-4">
            <button 
                onClick={() => {
                    setPracticeFinished(false);
                    setCurrentTransactionIdx(0);
                    setMaxTransactionReached(0);
                    setTransactionInputs({});
                    setTransactionFeedback(null);
                    setAnalysisAnswers({});
                    setAnalysisFeedback({});
                }}
                className="px-6 py-3 border border-slate-300 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all"
            >
                Review / Practice Again
            </button>
            <button onClick={() => setActiveTab('quiz')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">
                Proceed to Quiz
            </button>
          </div>
        </div>
      );
    }

    if (content?.practice.type === 'transaction-simulation') {
        const tx = content.practice.transactions[currentTransactionIdx];
        const isLastTransaction = currentTransactionIdx === content.practice.transactions.length - 1;
        
        return (
             <div className="max-w-5xl mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Context & Balances */}
                <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Scenario</h4>
                    <p className="text-slate-600 leading-relaxed">{content.practice.context}</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 text-sm">
                    <h4 className="font-bold text-slate-900 mb-3 flex justify-between items-center text-xs uppercase tracking-wider">
                    Balance Sheet <span className="text-slate-400 normal-case">Jan {currentTransactionIdx === 0 ? '1' : '...'}</span>
                    </h4>
                    <div className="space-y-2">
                    {(Object.entries(currentBalances) as [string, number][]).filter(([_, v]) => v !== 0).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-slate-700 border-b border-slate-200/50 pb-1 last:border-0">
                        <span className="truncate pr-2">{k}</span>
                        <span className={`font-mono font-medium ${v < 0 ? 'text-red-600' : ''}`}>£{v.toLocaleString()}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                {/* Right: Active Transaction */}
                <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Transaction {currentTransactionIdx + 1} / {content.practice.transactions.length}</h3>
                    <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">{tx.date}</span>
                    </div>
                    
                    <div className="p-8">
                    <p className="text-xl text-slate-900 mb-8 font-medium leading-relaxed">{tx.description}</p>
                    
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-8">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Record Financial Impact</h4>
                        <div className="space-y-4">
                        {tx.inputs.map(account => (
                            <div key={account} className="flex items-center gap-4">
                            <label className="w-1/3 text-slate-600 font-medium text-right text-sm">{account}</label>
                            <div className="w-2/3 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">£</span>
                                <input 
                                type="number" 
                                placeholder="0"
                                value={transactionInputs[account] || ''}
                                onChange={(e) => setTransactionInputs({...transactionInputs, [account]: e.target.value})}
                                disabled={!!transactionFeedback?.isCorrect}
                                className="w-full pl-7 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow font-mono text-sm"
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {showTransactionHint && tx.hint && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 flex gap-2 items-start">
                            <Lightbulb size={16} className="shrink-0 mt-0.5" />
                            <p>{tx.hint}</p>
                        </div>
                    )}

                    {transactionFeedback && (
                        <div className={`p-4 rounded-md mb-6 flex items-start gap-3 text-sm ${transactionFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {transactionFeedback.isCorrect ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                        <div>
                            <p className="font-bold">{transactionFeedback.isCorrect ? 'Correct' : 'Incorrect'}</p>
                            <p className="mt-1 opacity-90">{transactionFeedback.message}</p>
                        </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                        <div className="flex gap-4">
                            <button
                                onClick={prevTransaction}
                                disabled={currentTransactionIdx === 0}
                                className={`flex items-center gap-1 text-sm font-medium ${currentTransactionIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                onClick={nextTransaction}
                                disabled={!transactionFeedback?.isCorrect && currentTransactionIdx >= maxTransactionReached} 
                                className={`flex items-center gap-1 text-sm font-medium ${(!transactionFeedback?.isCorrect && currentTransactionIdx >= maxTransactionReached) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                             {/* Helpers */}
                            {!transactionFeedback?.isCorrect && (
                                <>
                                    <button 
                                        onClick={() => setShowTransactionHint(!showTransactionHint)}
                                        className="px-3 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md text-xs font-medium transition-colors"
                                        title="Show Hint"
                                    >
                                        {showTransactionHint ? 'Hide Hint' : 'Hint'}
                                    </button>
                                    <button 
                                        onClick={() => revealTransactionSolution(tx)}
                                        className="px-3 py-2 text-slate-500 hover:text-indigo-600 rounded-md text-xs font-medium transition-colors"
                                        title="Show Solution"
                                    >
                                        Show Solution
                                    </button>
                                </>
                            )}
                            
                            {!transactionFeedback?.isCorrect ? (
                            <button 
                                onClick={() => handleTransactionCheck(tx)}
                                className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                Check Answer
                            </button>
                            ) : (
                            <button 
                                onClick={nextTransaction}
                                className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                {isLastTransaction ? 'Finish Exercise' : 'Next Transaction'} <ArrowRight size={16} />
                            </button>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }

    if (content?.practice.type === 'analysis') {
         return (
            <div className="max-w-4xl mx-auto py-8 space-y-12">
                <div className="prose prose-slate max-w-none mb-8">
                     <h3>{content.practice.title}</h3>
                </div>

                {content.practice.scenarios.map((scenario) => (
                    <div key={scenario.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 p-4">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{scenario.title || "Scenario"}</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 text-slate-700 text-sm">
                                <p>{scenario.context}</p>
                            </div>

                            {/* Render Tables if exist */}
                            {scenario.tables && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                    {scenario.tables.map((table, tIdx) => (
                                        <div key={tIdx} className="border border-slate-200 rounded-md overflow-hidden">
                                            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-xs text-slate-600 text-center uppercase">
                                                {table.title}
                                            </div>
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-200">
                                                        {table.headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700">{h}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {table.rows.map((row, rIdx) => (
                                                        <tr key={rIdx} className={row[0]?.toString().includes("Total") ? "bg-slate-50 font-bold" : ""}>
                                                            {row.map((cell, cIdx) => (
                                                                <td key={cIdx} className="px-3 py-2 text-slate-600 font-mono">
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-6 pt-4 border-t border-slate-100">
                                {scenario.questions.map((q) => {
                                    const feedback = analysisFeedback[q.id];
                                    return (
                                        <div key={q.id} className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-800">{q.text}</label>
                                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                                {q.type === 'select' ? (
                                                     <select 
                                                        className="block w-full sm:w-64 pl-3 pr-10 py-2 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                                        value={analysisAnswers[q.id] || ''}
                                                        onChange={(e) => setAnalysisAnswers({...analysisAnswers, [q.id]: e.target.value})}
                                                        disabled={!!feedback?.isCorrect}
                                                     >
                                                        <option value="">Select answer...</option>
                                                        {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                     </select>
                                                ) : (
                                                    <div className="relative rounded-md shadow-sm w-full sm:w-48">
                                                        {q.prefix && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-slate-500 sm:text-sm">{q.prefix}</span></div>}
                                                        <input 
                                                            type={q.type}
                                                            className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 border ${q.prefix ? 'pl-7' : 'pl-3'}`}
                                                            placeholder={q.type === 'number' ? '0' : ''}
                                                            value={analysisAnswers[q.id] || ''}
                                                            onChange={(e) => setAnalysisAnswers({...analysisAnswers, [q.id]: e.target.value})}
                                                            disabled={!!feedback?.isCorrect}
                                                        />
                                                        {q.suffix && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-slate-500 sm:text-sm">{q.suffix}</span></div>}
                                                    </div>
                                                )}
                                                
                                                {!feedback?.isCorrect && (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => checkAnalysisAnswer(scenario.id, q.id, q.correctAnswer, q.explanation)}
                                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                                                        >
                                                            Check
                                                        </button>
                                                        {q.hint && (
                                                            <button 
                                                                onClick={() => setRevealedAnalysisHints(prev => ({...prev, [q.id]: !prev[q.id]}))}
                                                                className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                                                                title="Hint"
                                                            >
                                                                <Lightbulb size={16} />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => revealAnalysisSolution(q.id, q.correctAnswer, q.explanation)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                                                            title="Show Solution"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {revealedAnalysisHints[q.id] && !feedback?.isCorrect && (
                                                <div className="mt-1 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 italic">
                                                    Hint: {q.hint}
                                                </div>
                                            )}
                                            {feedback && (
                                                <div className={`text-sm mt-2 p-2 rounded ${feedback.isCorrect ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                                                    {feedback.isCorrect ? <CheckCircle2 size={14} className="inline mr-1" /> : <AlertCircle size={14} className="inline mr-1" />}
                                                    {feedback.message}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                 <div className="flex justify-end pt-6">
                     <button 
                         onClick={() => {
                             // Force complete for now
                             setPracticeFinished(true);
                             storageService.updateProgress(moduleId.toString(), { exerciseCompleted: true });
                             refreshData();
                         }}
                         className={`px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 shadow-sm transition-all ${practiceFinished ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                         Complete Exercise
                     </button>
                 </div>
            </div>
         );
    }
    
    return null;
  };

  const renderQuizTab = () => (
    <div className="max-w-2xl mx-auto py-8">
      {quizSubmitted ? (
        <div className="text-center animate-fade-in bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-lg relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * quizScore) / 100} className={`${quizScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`} />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-800">{quizScore}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {quizScore >= 70 ? 'Quiz Passed' : 'Keep Practicing'}
          </h2>
          <p className="text-slate-500 mb-8">
            {quizScore >= 70 
              ? "Great job! You've mastered the concepts in this module." 
              : "Review the learning material and try again to improve your score."}
          </p>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setQuizSubmitted(false);
                setQuizScore(0);
                setQuizAnswers({});
              }}
              className="px-6 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
            >
              Retry Quiz
            </button>
            {quizScore >= 70 && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {content.quiz.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex gap-2">
                  <span className="text-slate-400">{idx + 1}.</span> {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, optIdx) => (
                  <label key={optIdx} className={`group flex items-start gap-3 p-3 rounded-md cursor-pointer border transition-all ${quizAnswers[q.id] === optIdx ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${quizAnswers[q.id] === optIdx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                      {quizAnswers[q.id] === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-sm ${quizAnswers[q.id] === optIdx ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>{option}</span>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      className="hidden"
                      onChange={() => setQuizAnswers({...quizAnswers, [q.id]: optIdx})}
                      checked={quizAnswers[q.id] === optIdx}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <button 
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < content.quiz.length}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-24">
      {/* Module Header */}
      <div className="mb-8 bg-white p-8 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 text-slate-900 pointer-events-none">
            <span className="text-9xl">{content.meta.icon}</span>
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
            <span className="text-indigo-600">Module {moduleId}</span>
            <span>/</span>
            <span className="flex items-center gap-1">{content.meta.time}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
             {content.meta.title}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">{content.meta.subtitle}</p>
            
            {/* Progress Bar for Module */}
            <div className="mt-8 flex items-center gap-6 text-sm font-medium text-slate-600">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${moduleProgress?.conceptsRead.length === content.concepts.length ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    <BookOpen size={16} />
                    <span>Read {moduleProgress?.conceptsRead.length}/{content.concepts.length}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${moduleProgress?.exerciseCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    <PenTool size={16} />
                    <span>Practice</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${(moduleProgress?.quizScore || 0) >= 70 ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    <BrainCircuit size={16} />
                    <span>Quiz {moduleProgress?.quizScore ? `(${moduleProgress.quizScore}%)` : ''}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {[
            { id: 'learn', label: 'Learn', icon: BookOpen },
            { id: 'practice', label: 'Practice', icon: PenTool },
            { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            // @ts-ignore
            return (
              <button
                key={tab.id}
                // @ts-ignore
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold transition-all relative
                  ${isActive ? 'text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}
                `}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {tab.label}
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white p-6 md:p-8">
           {activeTab === 'learn' && renderLearnTab()}
           {activeTab === 'practice' && renderPracticeTab()}
           {activeTab === 'quiz' && renderQuizTab()}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 md:left-[260px] right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-between items-center z-10">
        <button
          onClick={() => navigate(moduleId === 1 ? '/dashboard' : `/module/${moduleId - 1}`)}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          {moduleId === 1 ? 'Dashboard' : 'Previous Module'}
        </button>

        <div className="flex gap-3">
             {moduleId < TOTAL_MODULES && (moduleProgress?.completed) && (
                <button
                    onClick={() => navigate(`/module/${moduleId + 1}`)}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors text-sm font-medium shadow-sm"
                >
                    <span>Next Module</span>
                    <ChevronRight size={16} />
                </button>
             )}
        </div>
      </div>
    </div>
  );
};