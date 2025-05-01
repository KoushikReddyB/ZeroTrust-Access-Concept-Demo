import React, { useEffect, useState } from 'react';

const LoadingAnimation = ({ message = "Securing Connection..." }) => {
  const [dots, setDots] = useState('');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        return prev.length < 3 ? prev + '.' : '';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-gray-900/95 to-gray-800/95">
      <div className="relative w-24 h-24 mb-6">
        {/* Shield Base */}
        <div className="absolute inset-0 bg-blue-500 rounded-t-full rounded-b-lg shadow-lg transform-gpu animate-pulse">
          <div className="absolute inset-1 bg-blue-600 rounded-t-full rounded-b-lg flex items-center justify-center">
            {/* Shield Inner Wave Animation */}
            <div className="absolute inset-1 bg-blue-400 rounded-t-full rounded-b-lg opacity-20 overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-white/30 animate-wave-slow transform-gpu"></div>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-white/20 animate-wave-fast transform-gpu"></div>
            </div>
            
            {/* Shield Icon */}
            <div className="text-white transform-gpu scale-75">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.674 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Pulse Rings */}
        <div className="absolute inset-0 -m-4">
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-ping-slow"></div>
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-blue-300/20 animate-ping-slower"></div>
          <div className="absolute inset-0 -m-4 rounded-full border border-blue-200/10 animate-ping-slowest"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="flex flex-col items-center">
        <p className="text-white text-xl font-medium tracking-wide">
          {message.endsWith('...') ? message.slice(0, -3) : message}<span className="animate-pulse">{dots}</span>
        </p>
        <div className="mt-3 bg-gray-700/50 rounded-full h-1.5 w-36 overflow-hidden">
          <div className="bg-blue-400 h-full w-1/3 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

/* Add these animations to your global CSS or tailwind config */
/* 
@keyframes wave-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes wave-fast {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes ping-slow {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(1.5); opacity: 0; }
}

@keyframes ping-slower {
  0% { transform: scale(1); opacity: 0.8; }
  75%, 100% { transform: scale(1.7); opacity: 0; }
}

@keyframes ping-slowest {
  0% { transform: scale(1); opacity: 0.6; }
  75%, 100% { transform: scale(1.9); opacity: 0; }
}

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

.animate-wave-slow {
  animation: wave-slow 3s ease-in-out infinite;
}

.animate-wave-fast {
  animation: wave-fast 2s ease-in-out infinite;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-slower {
  animation: ping-slower 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-slowest {
  animation: ping-slowest 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-loading-bar {
  animation: loading-bar 2s ease-in-out infinite;
}
*/