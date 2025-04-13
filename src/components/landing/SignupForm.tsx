
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onLoginClick: () => void;
  loading?: boolean;
  email?: string;
  setEmail?: (email: string) => void;
}

export const SignupForm = ({ 
  onSubmit, 
  onLoginClick, 
  loading = false,
  email,
  setEmail
}: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: email || "",
    company: "",
    password: ""
  });

  // Sync the form email state when the parent email prop changes
  useEffect(() => {
    if (email !== undefined && email !== formData.email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update parent email state if needed
    if (name === 'email' && setEmail) {
      setEmail(value);
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium text-black dark:text-white mb-4">Get Started</h2>
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Enter your name" 
            required 
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="Enter your company name" 
            value={formData.company}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Create a password" 
            required 
            minLength={6} 
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <Button 
          className="w-full bg-[#7efb98] text-black hover:bg-[#7efb98]/90"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Free Account"
          )}
        </Button>
        
        <p className="text-center text-xs text-black/60 dark:text-white/60">
          Already have an account? {" "}
          <button
            type="button"
            className="text-black dark:text-white underline"
            onClick={onLoginClick}
            disabled={loading}
          >
            Log in
          </button>
        </p>
      </form>
    </>
  );
};
