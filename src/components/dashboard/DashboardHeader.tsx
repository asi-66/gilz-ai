
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

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
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/5 dark:bg-black/5"
      >
        Logout
      </Button>
    </header>
  );
};

export default DashboardHeader;
