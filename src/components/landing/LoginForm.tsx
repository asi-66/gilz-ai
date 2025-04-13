
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
  onSignupClick,
  onForgotPasswordClick,
  loading = false,
  isInternalTool = false
}: LoginFormProps) => {
  return (
    <>
      <h2 className="text-xl font-medium text-black dark:text-white mb-4">
        {isInternalTool ? "Internal Tool Access" : "Welcome back"}
      </h2>
      
      {isInternalTool && (
        <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            This is a restricted internal tool. Please use your provided credentials.
          </p>
        </div>
      )}
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {!isInternalTool && (
              <button 
                type="button"
                className="text-xs text-black/60 dark:text-white/60 hover:text-black hover:dark:text-white"
                onClick={onForgotPasswordClick}
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
            required
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
            className="text-sm text-black/70 dark:text-white/70 cursor-pointer"
          >
            Remember me
          </label>
        </div>
        
        <Button 
          className="w-full bg-[#7efb98] text-black hover:bg-[#7efb98]/90"
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
        
        {!isInternalTool && (
          <p className="text-center text-xs text-black/60 dark:text-white/60">
            Don't have an account? {" "}
            <button
              type="button"
              className="text-black dark:text-white underline"
              onClick={onSignupClick}
            >
              Sign up
            </button>
          </p>
        )}
      </form>
    </>
  );
};
