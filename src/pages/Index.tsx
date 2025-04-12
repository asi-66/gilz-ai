
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import React from "react";
import { ChevronRight, MenuIcon, X } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Navigation */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#333333] mr-2">Gilz AI</span>
              <span className="bg-[#7efb98] h-2 w-2 rounded-full"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-[#4B5563] hover:text-[#1F2937] hover:bg-transparent focus:bg-transparent transition-colors" href="#">
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-[#4B5563] hover:text-[#1F2937] hover:bg-transparent focus:bg-transparent transition-colors" href="#">
                    Help/Support
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button 
              variant="default" 
              className="bg-[#333333] hover:bg-[#1F2937] text-white ml-4"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden">
          <nav className="flex flex-col space-y-6">
            <Link to="#" className="text-xl font-medium text-[#1F2937] hover:text-[#333333]" onClick={toggleMenu}>
              About
            </Link>
            <Link to="#" className="text-xl font-medium text-[#1F2937] hover:text-[#333333]" onClick={toggleMenu}>
              Help/Support
            </Link>
            <Button 
              variant="default" 
              className="w-full bg-[#333333] hover:bg-[#1F2937] text-white mt-4"
              onClick={() => {
                toggleMenu();
                navigate("/login");
              }}
            >
              Log In
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] leading-tight">
                Gilz AI: Resume Screening for TNP Consultants HR Team
              </h1>
              <p className="text-lg md:text-xl text-[#4B5563] mt-6">
                Streamline candidate evaluation with our AI-driven resume analysis system.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-[#333333] hover:bg-[#1F2937] text-white w-full sm:w-auto"
                  onClick={() => navigate("/login")}
                >
                  Log In
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img 
                src="/placeholder.svg" 
                alt="HR professional reviewing resumes with AI assistance" 
                className="w-full max-w-md rounded-lg shadow-xl animate-fade-in" 
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">
                Powerful Resume Screening Features
              </h2>
              <p className="text-lg text-[#4B5563] mt-4 max-w-2xl mx-auto">
                Gilz AI helps your HR team make better hiring decisions faster
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#7efb98]/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#333333]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">AI Resume Analysis</h3>
                <p className="text-[#4B5563]">
                  Automatically extract key information and evaluate candidate resumes against job requirements.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#7efb98]/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#333333]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Candidate Comparison</h3>
                <p className="text-[#4B5563]">
                  Easily compare multiple candidates with side-by-side analysis and skill matching.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#7efb98]/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#333333]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">AI-Powered Assistant</h3>
                <p className="text-[#4B5563]">
                  Get insights and recommendations from our intelligent chat assistant to help with hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 bg-[#333333] text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your hiring process?</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join TNP Consultants HR team in using Gilz AI to streamline candidate evaluation.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#333333] hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 px-6 md:px-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold text-[#333333] mr-2">Gilz AI</span>
                <span className="bg-[#7efb98] h-2 w-2 rounded-full"></span>
              </div>
              <p className="text-sm text-[#4B5563] mt-2">
                © {new Date().getFullYear()} TNP Consultants. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="#" className="text-[#4B5563] hover:text-[#1F2937]">Privacy Policy</Link>
              <Link to="#" className="text-[#4B5563] hover:text-[#1F2937]">Terms of Service</Link>
              <Link to="#" className="text-[#4B5563] hover:text-[#1F2937]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
