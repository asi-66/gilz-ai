
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onLoginClick: () => void;
}

export const SignupForm = ({ onSubmit, onLoginClick }: SignupFormProps) => {
  return (
    <>
      <h2 className="text-xl font-medium text-black dark:text-white mb-4">Get Started</h2>
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Enter your company name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a password" />
        </div>
        
        <Button 
          className="w-full bg-[#7efb98] text-black hover:bg-[#7efb98]/90"
          type="submit"
        >
          Create Free Account
        </Button>
        
        <p className="text-center text-xs text-black/60 dark:text-white/60">
          Already have an account? {" "}
          <button
            type="button"
            className="text-black dark:text-white underline"
            onClick={onLoginClick}
          >
            Log in
          </button>
        </p>
      </form>
    </>
  );
};
