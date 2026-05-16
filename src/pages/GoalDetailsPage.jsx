import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { goalsData } from '../data/goalsData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const GoalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const goal = goalsData.find(g => g.id === parseInt(id));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800 bg-[var(--color-sustain-bg)]">
        <div className="text-center glass-card p-12 rounded-3xl">
          <h2 className="text-3xl font-black mb-4 text-[#0f2e24]">Goal Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-full font-bold transition-all shadow-lg">Return to Basecamp</button>
        </div>
      </div>
    );
  }

  const Icon = goal.icon;

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center pb-24">
      {/* Animated Landscape Background from Calculator */}
      <AnimatedBackground height="600px" className="opacity-90" />

      <div className="absolute top-[600px] left-0 w-full h-full z-[-2] bg-[var(--color-sustain-bg)]"></div>

      {/* Dynamic Aura behind the content to represent the specific Goal's color */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] opacity-10 blur-3xl rounded-full z-[-1] pointer-events-none"
        style={{ backgroundColor: goal.colorHex }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center text-[#166534] hover:text-[#0f2e24] transition-colors mb-8 group font-bold tracking-wide"
        >
          <div className="bg-white/50 group-hover:bg-white p-2 rounded-full mr-3 shadow-sm transition-colors border border-[#166534]/10">
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          </div>
          Return to Goals
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Header & Icon Top/Side Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12 glass-card rounded-[2.5rem] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            {/* Massive Icon Highlight */}
            <div 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] flex items-center justify-center shadow-lg relative shrink-0 overflow-hidden"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundColor: goal.colorHex }}></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent"></div>
              <Icon className="w-16 h-16 sm:w-20 sm:h-20 relative z-10" style={{ color: goal.colorHex }} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-black tracking-widest mb-4 shadow-sm" style={{ backgroundColor: `${goal.colorHex}20`, color: goal.colorHex }}>
                SUSTAINABLE DEVELOPMENT GOAL {goal.id}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight text-[#0f2e24]">
                {goal.title}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl">
                {goal.shortDescription}
              </p>
            </div>
          </motion.div>

          {/* Detailed Content Columns */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-card rounded-3xl p-8 shadow-lg border border-white/60 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0fdf4]">
                  <div className="w-4 h-4 rounded-full bg-[#166534]"></div>
                </div>
                <h3 className="text-2xl font-black text-[#0f2e24]">Overview</h3>
              </div>
              <p className="text-slate-600 leading-loose text-lg font-medium">
                {goal.detailedDescription}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-lg border border-white/60 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0fdf4]" style={{ backgroundColor: `${goal.colorHex}15` }}>
                  <Icon className="w-5 h-5" style={{ color: goal.colorHex }} />
                </div>
                <h3 className="text-2xl font-black text-[#0f2e24]">Key Targets & Features</h3>
              </div>
              
              <ul className="space-y-6">
                {goal.features.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-start bg-white/50 rounded-2xl p-4 md:p-6 border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="mr-5 flex-shrink-0 mt-0.5 bg-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 
                        className="w-6 h-6" 
                        style={{ color: goal.colorHex }} 
                      />
                    </div>
                    <span className="text-slate-700 text-lg leading-relaxed font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Carbon Footprint Calculator Addition for Goal 13 */}
          {goal.id === 13 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-12 mt-4"
            >
              <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#4ade80]/30 bg-gradient-to-r from-white/80 to-[#f0fdf4]/80 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Background flare */}
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#4ade80] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#166534] text-white text-xs font-black tracking-wider rounded-full shadow-md">INTERACTIVE TOOL</span>
                  </div>
                  <h3 className="text-3xl font-black text-[#0f2e24] mb-4">Carbon Footprint Calculator</h3>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mb-6">
                    Take actionable steps towards combating climate change by understanding your own impact. Use our interactive Carbon Footprint Calculator to estimate your emissions and discover personalized ways to reduce them.
                  </p>
                  <a 
                    href="./project_NAS/index.html" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#166534] hover:bg-[#14532d] text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Open Calculator &rarr;
                  </a>
                </div>
                
                {/* Visual Graphic */}
                <div className="hidden md:flex flex-shrink-0 w-48 h-48 bg-white rounded-3xl shadow-lg border border-slate-100 items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#4ade80]/10 transform group-hover:scale-110 transition-transform duration-500"></div>
                  <Icon className="w-20 h-20 text-[#166534] relative z-10" />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GoalDetailsPage;
