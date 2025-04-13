
import React, { useEffect, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "@/components/landing/Navbar";
import { HeroContent } from "@/components/landing/HeroContent";
import { AuthFormContainer } from "@/components/landing/AuthFormContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Predefined credentials for this internal tool
const ADMIN_CREDENTIALS = [
  { username: "Giller@tnp", password: "Gilz123" },
  { username: "Nivu@tnp", password: "Gilz123" }
];

const Index = () => {
  const [formType, setFormType] = React.useState<"login" | "signup" | "forgotPassword">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for saved auth in localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);
  
  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate against predefined credentials
      const isValidCredentials = ADMIN_CREDENTIALS.some(
        cred => email === cred.username && password === cred.password
      );
      
      if (isValidCredentials) {
        // Set authentication in localStorage for persistence
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        
        toast({
          title: "Success",
          description: "You have been logged in successfully.",
        });
        
        navigate("/dashboard");
      } else {
        // Invalid credentials
        throw new Error("Invalid credentials. Access denied.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className={`${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
      <div className={`flex flex-col relative w-full ${isMobile ? 'min-h-screen' : 'min-h-screen'}`}>
        <Navbar 
          showLoginForm={false}
          handleLoginClick={() => {}} // No-op 
          handleSignupClick={() => {}} // No-op
        />

        {/* Hero Section with Two Columns */}
        <div className={`flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 gap-8 lg:gap-16 py-8 ${isMobile ? 'pb-16' : 'h-[calc(100vh-76px)]'}`}>
          {/* Left Column - Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 mb-8 md:mb-0">
            <HeroContent />
          </div>
          
          {/* Right Column - Login Form Only */}
          <div className="w-full md:w-1/2 flex justify-center">
            <AuthFormContainer 
              formType={formType}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              handleLogin={handleLogin}
              handleSignup={() => {}} // Empty function as signup is disabled
              setFormType={setFormType}
              loading={loading}
            />
          </div>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-4 left-0 right-0 md:left-6 md:right-auto text-xs text-black/60 dark:text-white/60 text-center md:text-left">
          © 2025 TNP Consultants
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
