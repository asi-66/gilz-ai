
import React, { useEffect, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "@/components/landing/Navbar";
import { HeroContent } from "@/components/landing/HeroContent";
import { AuthFormContainer } from "@/components/landing/AuthFormContainer";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  
  // Check for saved auth in localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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
          
          {/* Right Column - Login Form or Logged In State */}
          <div className="w-full md:w-1/2 flex justify-center">
            {!isAuthenticated ? (
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
            ) : (
              <div className="w-full max-w-md">
                <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-xl p-8 shadow-sm text-center">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Welcome!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">You are successfully logged in.</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
