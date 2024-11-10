import { UserAuthForm } from "@/views/auth/components/UserAuthForm";


export default function LoginPage() {
  return <>
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Simplified Product Development
      </h1>
      <p className="text-sm text-muted-foreground">
        Centralize all your team abilities and manage your product development at ease...
      </p>
    </div>
    <UserAuthForm />
  </>
}
