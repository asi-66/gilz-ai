
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
  loading?: boolean;
  isInternalTool?: boolean;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  onSubmit,
  loading = false
}: LoginFormProps) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label 
          htmlFor="email" 
          className="text-gray-700 dark:text-gray-300 font-medium"
        >
          Email
        </Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email"
          required 
          className="backdrop-blur-sm bg-white/20 dark:bg-black/20 border-black/20 dark:border-white/20 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="password" 
          className="text-gray-700 dark:text-gray-300 font-medium"
        >
          Password
        </Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password" 
          required
          className="backdrop-blur-sm bg-white/20 dark:bg-black/20 border-black/20 dark:border-white/20 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={rememberMe} 
          onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
        />
        <label
          htmlFor="remember"
          className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
        >
          Remember me
        </label>
      </div>
      
      <Button 
        className="w-full bg-[#7efb98] text-gray-900 hover:bg-[#7efb98]/90 font-semibold"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};
