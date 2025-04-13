
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onLoginClick: () => void;
  loading?: boolean;
}

export const SignupForm = ({ 
  onSubmit, 
  onLoginClick, 
  loading = false
}: SignupFormProps) => {
  return (
    <>
      <h2 className="text-xl font-medium text-black dark:text-white mb-4">Access Restricted</h2>
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <p className="text-center text-sm text-black/60 dark:text-white/60">
            This tool is only accessible to authorized personnel.
          </p>
        </div>
        
        <Button 
          className="w-full bg-[#7efb98] text-black hover:bg-[#7efb98]/90"
          type="button"
          onClick={onLoginClick}
          disabled={loading}
        >
          Go to Login
        </Button>
      </form>
    </>
  );
};
