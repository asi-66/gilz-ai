
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-4 text-left self-start"
    >
      {/* Logo with shadow animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-start mb-4"
      >
        <img 
          src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" 
          alt="Gilz AI Logo" 
          className="w-16 h-16 object-cover shadow-lg"
        />
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black dark:text-white text-left">
        Gilz AI: Resume Screening
      </h1>
      
      <p className="text-sm md:text-base text-black/80 dark:text-white/80 max-w-md text-left">
        Advanced AI-powered resume screening tool to help you find the 
        perfect candidates faster and with better accuracy.
      </p>
      
      {/* Feature list */}
      <div className="space-y-3 mt-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">AI Resume Analysis</h3>
            <p className="text-xs text-black/70 dark:text-white/70">
              Automatically extract key information and evaluate candidate resumes.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">Candidate Comparison</h3>
            <p className="text-xs text-black/70 dark:text-white/70">
              Compare multiple candidates with side-by-side analysis and skill matching.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">AI-Powered Assistant</h3>
            <p className="text-xs text-black/70 dark:text-white/70">
              Get insights and recommendations from our intelligent chat assistant.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
