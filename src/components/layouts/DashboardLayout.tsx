import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Briefcase, HelpCircle, Home, Plus, Settings } from "lucide-react";
import CreateJobModal from "@/components/dashboard/CreateJobModal";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs Management", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Resumes", href: "/dashboard/resumes", icon: FileText },
  { label: "Evaluations", href: "/dashboard/evaluations", icon: Users },
  { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help/Support", href: "/dashboard/help", icon: HelpCircle },
];

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
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveRoute(item.href)}
                    tooltip={item.label}
                  >
                    <Link to={item.href}>
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
                <button
                  type="button"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative rounded-full p-1 hover:bg-gray-100">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-white"></span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#7efb98]/30 text-[#1F2937]">HR</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Menu */}
          <Collapsible open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} className="md:hidden">
            <CollapsibleContent className="bg-white border-b border-gray-200">
              <div className="py-2 px-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      isActiveRoute(item.href)
                        ? "bg-[#7efb98]/20 text-[#1F2937]"
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full flex items-center justify-start gap-2" 
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

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
