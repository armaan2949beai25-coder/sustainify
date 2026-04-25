import React from 'react';

const AnimatedBackground = ({ height = "600px", className = "" }) => {
  return (
    <div 
      className={`absolute top-0 left-0 w-full z-[-2] overflow-hidden pointer-events-none ${className}`}
      style={{ 
        height: height, 
        background: 'linear-gradient(180deg, #fef3c7 0%, #dcfce7 60%, #86efac 100%)' 
      }}
    >
      {/* Sky Elements */}
      <div className="bg-sun"></div>
      <div className="bg-cloud bg-c1"></div>
      <div className="bg-cloud bg-c2"></div>
      <div className="bg-cloud bg-c3"></div>
      <div className="bg-balloon">
          <div className="bg-balloon-top"></div>
          <div className="bg-balloon-basket"></div>
      </div>
      
      <svg className="bg-hill bg-h3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="#4ade80" d="M0,288L80,266.7C160,245,320,203,480,197.3C640,192,800,224,960,240C1120,256,1280,256,1360,256L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
      
      {/* Back Trees */}
      <div style={{position: "absolute", left: "15%", bottom: "18%", transform: "scale(0.6)", opacity: 0.8, zIndex: 1}}>
          <div className="bg-tree"><div className="bg-trunk"></div><div className="bg-leaves"></div></div>
      </div>
      <div style={{position: "absolute", left: "80%", bottom: "16%", transform: "scale(0.7)", opacity: 0.8, zIndex: 1}}>
          <div className="bg-tree bg-pine"><div className="bg-trunk"></div><div className="bg-pine-leaves"></div></div>
      </div>

      <svg className="bg-hill bg-h2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="#22c55e" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,213.3C840,203,960,149,1080,138.7C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      
      {/* Eco House */}
      <div className="bg-eco-house" style={{left: "65%", bottom: "10%", zIndex: 2, transform: "scale(0.9)"}}>
          <div className="bg-house-base">
              <div className="bg-house-window"></div>
              <div className="bg-house-window bg-right-win"></div>
              <div className="bg-house-door"></div>
          </div>
          <div className="bg-house-roof">
              <div className="bg-solar-panel"></div>
          </div>
      </div>
      
      {/* Mid Trees */}
      <div style={{position: "absolute", left: "25%", bottom: "10%", transform: "scale(1)", zIndex: 2}}>
          <div className="bg-tree bg-pine"><div className="bg-trunk"></div><div className="bg-pine-leaves"></div></div>
      </div>
      
      <div style={{position: "absolute", left: "40%", bottom: "9%", transform: "scale(0.85)", zIndex: 2}}>
          <div className="bg-tree"><div className="bg-trunk"></div><div className="bg-leaves"></div></div>
      </div>

      <svg className="bg-hill bg-h1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="#14532d" d="M0,160L48,160C96,160,192,160,288,181.3C384,203,480,245,576,234.7C672,224,768,160,864,138.7C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      
      {/* Foreground Tree */}
      <div style={{position: "absolute", left: "10%", bottom: "2%", zIndex: 3}}>
          <div className="bg-tree bg-pine" style={{ transform: "scale(1.3)", transformOrigin: "bottom center" }}><div className="bg-trunk"></div><div className="bg-pine-leaves"></div></div>
      </div>

      {/* Deep overlay to merge into sustain-bg */}
      <div className="absolute w-full h-32 bottom-0 left-0 bg-gradient-to-t from-[var(--color-sustain-bg)] to-transparent z-[10]"></div>
    </div>
  );
};

export default AnimatedBackground;
