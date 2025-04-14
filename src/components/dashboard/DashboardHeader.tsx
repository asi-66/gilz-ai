
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const DashboardHeader = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: { 
  mobileMenuOpen?: boolean, 
  setMobileMenuOpen?: (open: boolean) => void 
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-transparent rounded-t-2xl">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-2 p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)}
        >
          <Menu size={24} className="text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/5 backdrop-blur-sm text-gray-800 dark:text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
