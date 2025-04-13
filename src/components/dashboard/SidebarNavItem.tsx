
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  href,
  icon: Icon,
  isActive,
}) => {
  return (
    <SidebarMenuItem key={label}>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={label}
      >
        <Link to={href}>
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarNavItem;
