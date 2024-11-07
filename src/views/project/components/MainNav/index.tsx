import { cn } from "@/lib/utils"
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/store.ts";
import useCurrentProject from "@/lib/hooks/useCurrentProject";

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const params = useParams();
  const currentProject = useCurrentProject();
  const { pathname } = useLocation();

  const links = [{
    path: `/projects/${currentProject.slug}`,
    label: 'Home'
  }, {
    path: `/projects/${currentProject.slug}/tasks`,
    label: 'Tasks'
  }, {
    path: `/projects/${currentProject.slug}/settings`,
    label: 'Settings'
  }, {
    path: `/projects/${currentProject.slug}/members`,
    label: 'Members'
  }];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn("text-sm font-medium transition-colors hover:text-primary", pathname !== link.path ? 'text-muted-foreground' : '')}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

