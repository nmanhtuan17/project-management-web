import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LogoIcon } from "@/components/icons/Logo.tsx";

export default function AuthLayout() {
  return <div
    className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
      <img src="https://res.cloudinary.com/dhafdz97m/image/upload/v1729763816/project-management_hjzipc.png" className="my-auto" />
    </div>
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Outlet />
      </div>
    </div>
  </div>
}
