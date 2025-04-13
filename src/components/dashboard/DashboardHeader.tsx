
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    <header className="flex justify-between items-center py-4 px-6 bg-blue-100 dark:bg-blue-900/80">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <Button onClick={handleLogout} variant="outline" className="border-blue-200/30 dark:border-blue-700/30">Logout</Button>
    </header>
  );
};

export default DashboardHeader;
