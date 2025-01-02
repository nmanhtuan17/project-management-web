import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import { Outlet } from "react-router-dom"

export const metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/projects/setting/profile",
  },
  {
    title: "Notifications",
    href: "/projects/setting/notification",
  }
]

interface SettingsLayoutProps {

}

export default function SettingsLayout({ }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 space-y-6 p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col flex-1 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl overflow-y-auto min-h-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}