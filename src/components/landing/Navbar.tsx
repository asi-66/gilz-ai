import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import React from "react";
import { useAuth } from "@/hooks/use-auth";

export const Navbar = ({ 
  showLoginForm, 
  handleLoginClick, 
  handleSignupClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthAction = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      if (showLoginForm) {
        handleSignupClick();
      } else {
        handleLoginClick();
      }
    }
  };

  return (
    <>
      <header className="w-full backdrop-blur-md border-b border-black/10 py-4 px-6 md:px-12 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-medium text-black dark:text-white mr-2">Gilz AI</span>
              <span className="bg-[#7efb98] h-2 w-2 rounded-full"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
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
              variant="outline" 
              className="rounded-full border border-black/30 dark:border-white/30 text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent transition-all hover:border-black dark:hover:border-white bg-transparent"
              onClick={handleAuthAction}
            >
              {session ? "Dashboard" : (showLoginForm ? "Sign Up" : "Log In")}
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-black dark:text-white">
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </Button>
          </div>
        </div>
      </header>

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
              variant="outline" 
              className="w-full rounded-full border border-black/30 dark:border-white/30 text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent transition-all hover:border-black dark:hover:border-white bg-transparent mt-4"
              onClick={() => {
                toggleMenu();
                handleAuthAction();
              }}
            >
              {session ? "Dashboard" : (showLoginForm ? "Sign Up" : "Log In")}
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};
