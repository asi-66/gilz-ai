
import React from "react";
import { Link } from "react-router-dom";
import { Home, Briefcase, Settings, HelpCircle, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarNavProps {
  isActiveRoute: (path: string) => boolean;
  onCreateJobClick: () => void;
  onLogoutClick: () => void;
}

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Job Flows", href: "/dashboard/job-flow", icon: Briefcase },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

const SidebarNav: React.FC<SidebarNavProps> = ({ 
  isActiveRoute, 
  onCreateJobClick, 
  onLogoutClick 
}) => {
  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" 
            alt="Gilz AI Logo" 
            className="w-8 h-8 mr-2" 
          />
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
          className="w-full flex items-center justify-start gap-2" 
          onClick={onLogoutClick}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
