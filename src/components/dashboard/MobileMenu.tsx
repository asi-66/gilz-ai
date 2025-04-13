
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
  isActiveRoute: (path: string) => boolean;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onOpenChange,
  items,
  isActiveRoute,
  onLogout,
}) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="md:hidden">
      <CollapsibleContent className="glass-card rounded-b-2xl border-t-0">
        <div className="py-2 px-4 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex-1">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute(item.href)
                    ? "bg-white/10 dark:bg-black/20 text-gray-800 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-white/5"
                }`}
                onClick={() => onOpenChange(false)}
              >
                <item.icon size={18} className={isActiveRoute(item.href) ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"} />
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-white/5 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center justify-start gap-2 bg-transparent border-white/10 dark:border-white/5 text-gray-700 dark:text-gray-300" 
              onClick={onLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
          
          <div className="text-xs text-black/60 dark:text-white/60 py-2 text-center mt-auto">
            © 2025 TNP Consultants
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MobileMenu;
