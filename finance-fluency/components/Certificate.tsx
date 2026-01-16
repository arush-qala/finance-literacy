import React from 'react';
import { Download, Share2, Award, Star } from 'lucide-react';

interface CertificateProps {
  userName: string;
  completionDate: string;
  averageScore: number;
}

export const Certificate: React.FC<CertificateProps> = ({ userName, completionDate, averageScore }) => {
  
  const handleShare = () => {
    const text = `I just completed the Finance Fluency certification! 🎓\n\nCertified in Accounting Essentials for Data Analysts.\nAvg Score: ${averageScore}%\n\n#FinanceFluency #DataAnalytics #Accounting`;
    navigator.clipboard.writeText(text);
    alert('Achievement copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Confetti effect placeholder - usually requires a library, but we'll use CSS/SVG decoration */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">🎉 Congratulations! 🎉</h2>
        <p className="text-slate-600">You have successfully completed the entire curriculum.</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border-8 border-double border-slate-200 relative overflow-hidden text-center">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-br-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50 rounded-tl-full opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg">
              <Award size={48} />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-wide uppercase">Certificate of Completion</h1>
          
          <p className="text-slate-500 italic mb-8 text-lg">This certifies that</p>
          
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 mb-8 font-serif border-b-2 border-indigo-100 inline-block pb-4 px-8">
            {userName}
          </h2>
          
          <p className="text-slate-600 text-lg mb-8">has successfully completed the</p>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-wider">Finance Fluency</h3>
          <p className="text-slate-500 font-medium mb-10">Accounting Essentials for Data Analysts</p>
          
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-10 text-left">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Completed On</p>
              <p className="font-mono text-slate-800">{completionDate}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Average Score</p>
               <div className="flex items-center gap-2">
                 <p className="font-mono text-slate-800 font-bold">{averageScore}%</p>
                 <div className="flex">
                   {[1,2,3,4,5].map(i => (
                     <Star key={i} size={12} className={`${i <= Math.round(averageScore/20) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                   ))}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
             <Star size={16} className="fill-current" />
             <span>Finance Fluency Certified</span>
             <Star size={16} className="fill-current" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Download size={18} />
          Print / Save PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <Share2 size={18} />
          Share Achievement
        </button>
      </div>
    </div>
  );
};