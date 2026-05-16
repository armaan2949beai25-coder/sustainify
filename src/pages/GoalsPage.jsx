import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { goalsData } from '../data/goalsData';
import AnimatedBackground from '../components/AnimatedBackground';

const GoalsPage = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center bg-gradient-to-br from-[var(--color-sustain-bg)] via-[#f0fdf4] to-[#dcfce7] pt-8 pb-32">
      {/* Animated Landscape Background from Calculator */}
      <AnimatedBackground height="600px" className="opacity-90" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 p-12 rounded-[2rem] max-w-4xl mx-auto relative overflow-hidden shadow-[0_20px_50px_rgba(4,120,87,0.3)] bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] border border-[#10b981]/30"
        >
          {/* Decorative glowing orbs */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#34d399] rounded-full mix-blend-screen filter blur-[60px] opacity-40"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#10b981] rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-[#6ee7b7] border border-white/20 backdrop-blur-md rounded-full text-sm font-bold tracking-widest mb-6 shadow-sm">
              The Complete Matrix
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-md">
              The 17 Sustainable Development Goals
            </h1>
            <p className="text-xl text-[#a7f3d0] max-w-2xl mx-auto font-medium leading-relaxed">
               Select a goal below to explore its specific targets, understand the global challenges it addresses, and discover how it aims to transform our world by 2030.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {goalsData.map((goal) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/goal/${goal.id}`)}
                className="cursor-pointer bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 flex flex-col h-full border border-[#bbf7d0] hover:border-[#22c55e] hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.4)] shadow-md transition-all duration-300 relative group overflow-hidden"
              >
                {/* Thin colored line at bottom instead of full block to keep it light */}
                <div 
                  className="absolute bottom-0 left-0 h-[6px] w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: goal.colorHex }}
                />

                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    className="p-3 rounded-xl shadow-sm"
                    style={{ backgroundColor: `${goal.colorHex}20`, color: goal.colorHex }}
                  >
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">
                    <span className="text-slate-400 text-xs tracking-wider block mb-1 font-mono">GOAL {goal.id}</span>
                    {goal.title}
                  </h2>
                </div>
                
                <p className="text-slate-600 text-sm flex-grow leading-relaxed font-medium">
                  {goal.shortDescription}
                </p>
                
                <div className="mt-6 flex justify-end">
                  <span 
                    className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 group-hover:px-4 transition-all"
                    style={{ backgroundColor: `${goal.colorHex}15`, color: goal.colorHex }}
                  >
                    Details &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsPage;
