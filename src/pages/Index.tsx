
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "@/components/landing/Navbar";
import { HeroContent } from "@/components/landing/HeroContent";
import { AuthFormContainer } from "@/components/landing/AuthFormContainer";

const Index = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = React.useState<"login" | "signup" | "forgotPassword">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleLoginClick = () => {
    setFormType("login");
  };

  const handleSignupClick = () => {
    setFormType("signup");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <AuroraBackground className="overflow-hidden">
      <div className="min-h-screen flex flex-col relative w-full">
        <Navbar 
          showLoginForm={formType === "login"}
          handleLoginClick={handleLoginClick}
          handleSignupClick={handleSignupClick}
        />

        {/* Hero Section with Two Columns */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 gap-8 lg:gap-16 py-8 h-[calc(100vh-76px)]">
          {/* Left Column - Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 mb-8 md:mb-0">
            <HeroContent />
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
          />
        </div>

        {/* TNP Attribution */}
        <div className="absolute bottom-4 left-6 text-xs text-black/60 dark:text-white/60">
          © 2025 TNP Consultants
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
