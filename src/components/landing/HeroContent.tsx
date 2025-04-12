
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-4"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black dark:text-white">
        Gilz AI: Resume Screening
      </h1>
      
      <p className="text-sm md:text-base text-black/80 dark:text-white/80 max-w-md line-clamp-2">
        Advanced AI-powered resume screening tool to help you find the 
        perfect candidates faster and with better accuracy.
      </p>
      
      {/* Feature list */}
      <div className="space-y-3 mt-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">AI Resume Analysis</h3>
            <p className="text-xs text-black/70 dark:text-white/70 line-clamp-1">Automatically extract key information and evaluate candidate resumes.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">Candidate Comparison</h3>
            <p className="text-xs text-black/70 dark:text-white/70 line-clamp-1">Compare multiple candidates with side-by-side analysis and skill matching.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
          <div>
            <h3 className="text-base font-medium text-black dark:text-white">AI-Powered Assistant</h3>
            <p className="text-xs text-black/70 dark:text-white/70 line-clamp-1">Get insights and recommendations from our intelligent chat assistant.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
