
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, X, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import React from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleSignupClick = () => {
    setShowLoginForm(false);
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
        {/* Navigation */}
        <header className="w-full backdrop-blur-md border-b border-black/10 py-4 px-6 md:px-12 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-medium text-black dark:text-white mr-2">Gilz AI</span>
                <span className="bg-[#7efb98] h-2 w-2 rounded-full"></span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-transparent focus:bg-transparent transition-colors" href="#">
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-transparent focus:bg-transparent transition-colors" href="#">
                      Help/Support
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <ThemeToggle />
              <Button 
                variant="default" 
                className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 ml-4"
                onClick={() => {
                  if (showLoginForm) {
                    handleSignupClick();
                  } else {
                    handleLoginClick();
                  }
                }}
              >
                {showLoginForm ? "Sign Up" : "Log In"}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-black dark:text-white">
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 backdrop-blur-md z-50 pt-24 px-6 md:hidden">
            <nav className="flex flex-col space-y-6">
              <Link to="#" className="text-xl font-medium text-black dark:text-white hover:text-black/80 dark:hover:text-white/80" onClick={toggleMenu}>
                About
              </Link>
              <Link to="#" className="text-xl font-medium text-black dark:text-white hover:text-black/80 dark:hover:text-white/80" onClick={toggleMenu}>
                Help/Support
              </Link>
              <Button 
                variant="default" 
                className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 mt-4"
                onClick={() => {
                  toggleMenu();
                  if (showLoginForm) {
                    handleSignupClick();
                  } else {
                    handleLoginClick();
                  }
                }}
              >
                {showLoginForm ? "Sign Up" : "Log In"}
              </Button>
            </nav>
          </div>
        )}

        {/* Hero Section with Two Columns */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 gap-8 lg:gap-16 py-8 h-[calc(100vh-76px)]">
          {/* Left Column - Content */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black dark:text-white">
                Gilz AI: Resume Screening
              </h1>
              
              <p className="text-sm md:text-base text-black/80 dark:text-white/80 max-w-md">
                Advanced AI-powered resume screening tool to help you find the 
                perfect candidates faster and with better accuracy.
              </p>
              
              {/* Feature list */}
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
                  <div>
                    <h3 className="text-base font-medium text-black dark:text-white">AI Resume Analysis</h3>
                    <p className="text-sm text-black/70 dark:text-white/70">Automatically extract key information and evaluate candidate resumes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
                  <div>
                    <h3 className="text-base font-medium text-black dark:text-white">Candidate Comparison</h3>
                    <p className="text-sm text-black/70 dark:text-white/70">Compare multiple candidates with side-by-side analysis and skill matching.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#7efb98] mt-1" />
                  <div>
                    <h3 className="text-base font-medium text-black dark:text-white">AI-Powered Assistant</h3>
                    <p className="text-sm text-black/70 dark:text-white/70">Get insights and recommendations from our intelligent chat assistant.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Sign Up/Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full md:w-1/2 max-w-sm"
          >
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-xl p-6 shadow-sm">
              {showLoginForm ? (
                // Login Form
                <>
                  <h2 className="text-xl font-medium text-black dark:text-white mb-4">Log In</h2>
                  
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link to="/forgot-password" className="text-xs font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </Label>
                    </div>
                    
                    <Button 
                      className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      type="submit"
                    >
                      Sign In
                    </Button>
                    
                    <p className="text-center text-xs text-black/60 dark:text-white/60">
                      Don't have an account? {" "}
                      <button
                        type="button"
                        className="text-black dark:text-white underline"
                        onClick={handleSignupClick}
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                // Sign Up Form
                <>
                  <h2 className="text-xl font-medium text-black dark:text-white mb-4">Get Started</h2>
                  
                  <form className="space-y-4" onSubmit={handleSignup}>
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
                        onClick={handleLoginClick}
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* TNP Attribution */}
        <div className="absolute bottom-4 left-6 text-xs text-black/60 dark:text-white/60">
          © 2024 TNP Consultants
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
