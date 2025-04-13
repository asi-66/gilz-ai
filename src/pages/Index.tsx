
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "@/components/landing/Navbar";
import { HeroContent } from "@/components/landing/HeroContent";
import { AuthFormContainer } from "@/components/landing/AuthFormContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const [formType, setFormType] = React.useState<"login" | "signup" | "forgotPassword">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleLoginClick = () => {
    setFormType("login");
  };

  const handleSignupClick = () => {
    setFormType("signup");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Successful login - navigate will happen automatically due to session change
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get form data from the event
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get('name') as string;
    const signupEmail = formData.get('email') as string;
    const company = formData.get('company') as string;
    const signupPassword = formData.get('password') as string;
    
    try {
      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            company: company,
          },
        },
      });
      
      if (error) throw error;
      
      // Successful signup
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You will be redirected to the dashboard.",
      });
      
      // Note: Redirection will happen automatically when session changes due to useEffect above
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className={`${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
      <div className={`flex flex-col relative w-full ${isMobile ? 'min-h-full' : 'min-h-screen'}`}>
        <Navbar 
          showLoginForm={formType === "login"}
          handleLoginClick={handleLoginClick}
          handleSignupClick={handleSignupClick}
        />

        {/* Hero Section with Two Columns */}
        <div className={`flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 gap-8 lg:gap-16 py-8 ${isMobile ? '' : 'h-[calc(100vh-76px)]'}`}>
          {/* Left Column - Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 mb-8 md:mb-0">
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-xl p-6 shadow-sm">
              <HeroContent />
            </div>
          </div>
          
          {/* Right Column - Sign Up/Login/Forgot Password Form */}
          <AuthFormContainer 
            formType={formType}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            setFormType={setFormType}
            loading={loading}
          />
        </div>

        {/* Attribution */}
        <div className="absolute bottom-4 left-6 text-xs text-black/60 dark:text-white/60">
          © 2025 TNP Consultants
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
