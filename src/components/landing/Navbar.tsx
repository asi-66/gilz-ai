
import { useState, useCallback, memo } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavbarProps {
  showLoginForm: boolean;
  handleLoginClick: () => void;
  handleSignupClick: () => void;
}

export const Navbar = memo(({ 
  showLoginForm, 
  handleLoginClick, 
  handleSignupClick 
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

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
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-black dark:text-white">
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
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
          </nav>
        </div>
      )}
    </>
  );
});

Navbar.displayName = "Navbar";
