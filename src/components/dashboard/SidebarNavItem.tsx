
import { memo } from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

const SidebarNavItem = memo(({
  label,
  href,
  icon: Icon,
  isActive,
}: SidebarNavItemProps) => {
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
});

SidebarNavItem.displayName = "SidebarNavItem";

export default SidebarNavItem;
