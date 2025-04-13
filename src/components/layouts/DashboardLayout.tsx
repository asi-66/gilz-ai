
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Briefcase,
  HelpCircle,
  Home,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarProvider, 
} from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileMenu from "@/components/dashboard/MobileMenu";
import SidebarNavItem from "@/components/dashboard/SidebarNavItem";

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
    { label: "Settings", href: "/dashboard/settings", icon: HelpCircle },
    { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-[#F9FAFB]">
        {/* Sidebar component */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center">
              <img src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" 
                alt="Gilz AI Logo" 
                className="w-8 h-8 mr-2" />
              <span className="text-xl font-bold text-[#333333]">Gilz AI</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActiveRoute(item.href)}
                />
              ))}
            </SidebarMenu>
            
            <div className="px-3 py-2">
              <Button 
                className="w-full flex items-center justify-start gap-2 bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
                onClick={() => setCreateJobModalOpen(true)}
              >
                <Plus size={18} />
                <span>Create New Job Flow</span>
              </Button>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-start gap-2" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

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
