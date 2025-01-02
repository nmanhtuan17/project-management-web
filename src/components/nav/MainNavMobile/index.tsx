import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store.ts";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { HTMLAttributes, useState } from "react";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

export const MainNavMobile = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const { currentProject } = useCurrentProject();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const links = [{
    path: currentProject._id ? `/projects/${currentProject.slug}` : `/`,
    label: 'Home'
  }, {
    path: `/mails/inbox`,
    label: 'Mails'
  }]

  return (
    <nav
      className={cn("flex items-center", className)}
      {...props}
    >
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-0 w-8 h-8 hover:border mr-2" variant="ghost">
        <Menu size={18} />
      </Button>
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 bg-background w-56 flex flex-col gap-1 px-2 py-4 transition-all duration-300 ${isCollapsed ? "translate-x-0" : "-translate-x-56"}`}>
        {links.map((link) => (
          <Link
            onClick={() => setIsCollapsed(!isCollapsed)}
            key={link.path}
            to={link.path}
            className={cn("text-sm py-2 px-3 rounded-md font-medium transition-colors hover:bg-accent hover:text-primary", pathname !== link.path ? 'text-muted-foreground ' : 'bg-accent')}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`z-40 fixed top-0 left-0 bottom-0 right-0 bg-black/30 dark:bg-white/15 transition-all duration-300 ${isCollapsed ? "block" : "hidden"}`}
      />

    </nav>
  )
}
