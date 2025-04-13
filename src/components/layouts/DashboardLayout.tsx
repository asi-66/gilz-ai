
import { useState, useCallback, ReactNode, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Briefcase, Settings, HelpCircle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { CreateJobModal } from "@/components/dashboard/modals";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileMenu from "@/components/dashboard/MobileMenu";
import SidebarNav from "@/components/dashboard/SidebarNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: typeof Home;
}

const navigationItems: NavigationItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Job Flows", href: "/dashboard/job-flow", icon: Briefcase },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);

  const isActiveRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  }, [navigate]);

  const handleCreateJobSuccess = useCallback((jobId: string) => {
    navigate(`/dashboard/job-flow/${jobId}`);
  }, [navigate]);

  const handleSetMobileMenuOpen = useCallback((value: boolean) => {
    setMobileMenuOpen(value);
  }, []);

  const handleSetCreateJobModalOpen = useCallback((value: boolean) => {
    setCreateJobModalOpen(value);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Sidebar component */}
        <SidebarNav 
          isActiveRoute={isActiveRoute}
          onCreateJobClick={() => handleSetCreateJobModalOpen(true)}
          onLogoutClick={handleLogout}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <DashboardHeader 
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={handleSetMobileMenuOpen}
          />

          {/* Mobile Navigation Menu */}
          <MobileMenu
            open={mobileMenuOpen}
            onOpenChange={handleSetMobileMenuOpen}
            items={navigationItems}
            isActiveRoute={isActiveRoute}
            onLogout={handleLogout}
          />

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
      
      {/* Create Job Modal */}
      <CreateJobModal 
        isOpen={createJobModalOpen}
        onClose={() => handleSetCreateJobModalOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </SidebarProvider>
  );
});

DashboardLayout.displayName = "DashboardLayout";

export default DashboardLayout;
