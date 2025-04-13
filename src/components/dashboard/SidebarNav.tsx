
import { memo } from "react";
import { Link } from "react-router-dom";
import { Home, Briefcase, Settings, HelpCircle, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarNavItem from "./SidebarNavItem";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarNavProps {
  isActiveRoute: (path: string) => boolean;
  onCreateJobClick: () => void;
  onLogoutClick: () => void;
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

const SidebarNav = memo(({ 
  isActiveRoute, 
  onCreateJobClick, 
  onLogoutClick 
}: SidebarNavProps) => {
  return (
    <Sidebar className="hidden md:flex glass-card h-auto my-4 ml-4 mr-0">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" 
            alt="Gilz AI Logo" 
            className="w-8 h-8 mr-2" 
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">Gilz AI</span>
        </Link>
        <ThemeToggle />
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
            className="w-full flex items-center justify-start gap-2 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 border-white/10 dark:border-white/5 text-black dark:text-white"
            onClick={onCreateJobClick}
          >
            <Plus size={18} />
            <span>Create New Job Flow</span>
          </Button>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-start gap-2 bg-transparent border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300" 
          onClick={onLogoutClick}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
        
        <div className="text-xs text-black/60 dark:text-white/60 py-2 text-center mt-2">
          © 2025 TNP Consultants
        </div>
      </SidebarFooter>
    </Sidebar>
  );
});

SidebarNav.displayName = "SidebarNav";

export default SidebarNav;
