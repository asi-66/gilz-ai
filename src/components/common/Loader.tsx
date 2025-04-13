
import { useEffect, useState } from "react"

export const Loader = () => {
  const [scale, setScale] = useState(0.8);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => prev === 0.8 ? 1 : 0.8);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      <div 
        className="transition-all duration-700 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" 
            alt="Gilz AI Logo" 
            className="w-16 h-16 mr-3" 
          />
          <span className="text-3xl font-bold text-gray-800 dark:text-white">Gilz AI</span>
          <span className="bg-[#7efb98] h-3 w-3 rounded-full ml-2 animate-pulse"></span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
    </div>
  )
}
