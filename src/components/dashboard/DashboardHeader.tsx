
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
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <Button onClick={handleLogout} variant="outline">Logout</Button>
    </header>
  );
};

export default DashboardHeader;
