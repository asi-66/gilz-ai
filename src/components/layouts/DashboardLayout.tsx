
import { useState, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Briefcase, Settings, HelpCircle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileMenu from "@/components/dashboard/MobileMenu";
import SidebarNav from "@/components/dashboard/SidebarNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleCreateJobSuccess = (jobId: string) => {
    navigate(`/dashboard/job-flow/${jobId}`);
  };

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Job Flows", href: "/dashboard/job-flow", icon: Briefcase },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-[#F9FAFB]">
        {/* Sidebar component */}
        <SidebarNav 
          isActiveRoute={isActiveRoute}
          onCreateJobClick={() => setCreateJobModalOpen(true)}
          onLogoutClick={handleLogout}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <DashboardHeader 
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          {/* Mobile Navigation Menu */}
          <MobileMenu
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            items={navigationItems}
            isActiveRoute={isActiveRoute}
            onLogout={handleLogout}
          />

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      
      {/* Create Job Modal */}
      <CreateJobModal 
        isOpen={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </SidebarProvider>
  );
};

export default DashboardLayout;
