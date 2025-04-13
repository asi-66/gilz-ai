
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

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
      <CollapsibleContent className="backdrop-blur-md bg-blue-100/10 dark:bg-blue-900/20 border-b border-blue-200/20 dark:border-blue-700/20">
        <div className="py-2 px-4 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex-1">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute(item.href)
                    ? "bg-[#7efb98]/20 text-[#1F2937] dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100/10 dark:hover:bg-blue-800/20"
                }`}
                onClick={() => onOpenChange(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t border-blue-200/20 dark:border-blue-700/20">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-start gap-2 bg-transparent border-blue-200/30 dark:border-blue-700/30 text-gray-700 dark:text-gray-300" 
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
