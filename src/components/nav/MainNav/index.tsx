import { cn } from "@/lib/utils"
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/store.ts";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const params = useParams();
  const { currentProject } = useCurrentProject();
  const { pathname } = useLocation();

  const links = [{
    path: currentProject._id ? `/projects/${currentProject.slug}` : `/`,
    label: 'Trang chủ'
  }, {
    path: `/mails/inbox`,
    label: 'Email'
  }]

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

