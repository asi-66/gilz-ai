
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
        className={isActive ? "bg-white/20 dark:bg-black/20 font-medium" : "hover:bg-white/10 dark:hover:bg-white/5"}
      >
        <Link to={href} className="flex items-center gap-3">
          <Icon size={20} className={isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"} />
          <span className={isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"}>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

SidebarNavItem.displayName = "SidebarNavItem";

export default SidebarNavItem;
