import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Globe, ShieldCheck, HeartHandshake } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center">
      
      {/* Sustainify Hero Background Illustration */}
      <AnimatedBackground height="800px" className="opacity-90" />

      {/* Solid background covering rest of page below hero */}
      <div className="absolute top-[800px] left-0 w-full h-full z-[-2] bg-gradient-to-b from-[var(--color-sustain-bg)] to-[#ecfdf5]"></div>

      {/* Hero Content Card */}
      <div className="w-full flex justify-center pt-24 pb-20 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card max-w-4xl w-full rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <p className="text-[#166534] font-bold text-sm tracking-widest uppercase mb-4">
            Explore the United Nations Initiative
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-[#0f2e24] mb-10 leading-tight">
            Transforming Our World with <br className="hidden md:block"/> 17 Global Goals
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button onClick={() => navigate('/goals')} className="bg-[#166534] hover:bg-[#14532d] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto">
              Explore Goals
            </button>
            <a href="https://sdgs.un.org/goals" target="_blank" rel="noreferrer" className="border-2 border-[#166534] hover:bg-[#f0fdf4] text-[#166534] px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto no-underline">
              Official Reference <Play className="w-4 h-4 fill-current" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Educational Section below the Hero */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h2 className="text-4xl font-black text-[#0f2e24] mb-6">What are the SDGs?</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
              The Sustainable Development Goals (SDGs), also known as the Global Goals, were adopted by the United Nations in 2015 as a universal call to action. Their immense scope addresses the critical global challenges we face daily.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              They are designed as a "blueprint to achieve a better and more sustainable future for all" by tracking a network of interconnected goals across social, economic, and environmental spectrums.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex items-center justify-center h-80"
          >
             {/* Abstract visual art piece for SDGs */}
             <div className="relative w-48 h-48">
                <GloballyAnimatedIcon />
             </div>
          </motion.div>
        </div>

        {/* Pillars of the SDGs */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-[#0f2e24] mb-4">The Core Pillars</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
             The 17 global goals rest upon three interconnected dimensions of sustainable development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="glass-card p-10 rounded-[2rem]"
           >
             <div className="w-16 h-16 bg-[#e5f5d6] text-[#166534] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-bold text-[#0f2e24] mb-4">Economic Growth</h3>
             <p className="text-slate-600 font-medium">Fostering sustained, inclusive economic systems that provide fair wealth distribution and decent working environments without harming ecosystems.</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="glass-card p-10 rounded-[2rem]"
           >
             <div className="w-16 h-16 bg-[#f0fdf4] text-[#166534] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <HeartHandshake className="w-8 h-8" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-bold text-[#0f2e24] mb-4">Social Inclusion</h3>
             <p className="text-slate-600 font-medium">Eliminating severe poverty and hunger, guaranteeing equal access to rich education, gender equality, and adequate healthcare standards.</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="glass-card p-10 rounded-[2rem]"
           >
             <div className="w-16 h-16 bg-[#b7ecc3] text-[#166534] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Globe className="w-8 h-8" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-bold text-[#0f2e24] mb-4">Environmental Protection</h3>
             <p className="text-slate-600 font-medium">Securing life below water and on land through active climate action, massive clean energy restructuring, and sustainable production paradigms.</p>
           </motion.div>
        </div>

        <div className="mt-24 text-center">
           <button onClick={() => navigate('/goals')} className="text-lg bg-[#0f2e24] text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform duration-300">
             View All 17 Goals
           </button>
        </div>
      </div>
    </div>
  );
};

// Abstract aesthetic component
const GloballyAnimatedIcon = () => (
   <div className="relative w-full h-full animate-[spin_40s_linear_infinite]">
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#fcd34d] mix-blend-multiply opacity-80 blur-[2px]"></div>
      <div className="absolute top-12 left-0 w-24 h-24 rounded-full bg-[#68d391] mix-blend-multiply opacity-80 blur-[2px]"></div>
      <div className="absolute bottom-0 right-8 w-20 h-20 rounded-full bg-[#4ade80] mix-blend-multiply opacity-80 blur-[2px]"></div>
      <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-[#0f2e24]" strokeWidth={1} />
   </div>
);

export default HomePage;
