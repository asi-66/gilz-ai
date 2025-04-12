
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onLoginClick: () => void;
}

export const ForgotPasswordForm = ({ onLoginClick }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "If your email is in our system, you will receive password reset instructions shortly.",
      });
    }, 1500);
  };

  return (
    <>
      <h2 className="text-xl font-medium text-black dark:text-white mb-4">Reset Password</h2>

      {!isSubmitted ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-black/60 dark:text-white/60">
              We'll send you a link to reset your password.
            </p>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </div>
          
          <p className="text-center text-xs text-black/60 dark:text-white/60">
            <button
              type="button"
              className="text-black dark:text-white underline"
              onClick={onLoginClick}
            >
              Back to login
            </button>
          </p>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="rounded-full bg-green-500/20 p-3 inline-flex mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-black dark:text-white">Check your email</h3>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            We've sent a password reset link to {email}
          </p>
          <div className="pt-2">
            <button
              type="button"
              className="text-black dark:text-white underline text-sm"
              onClick={onLoginClick}
            >
              Back to login
            </button>
          </div>
        </div>
      )}
    </>
  );
};
