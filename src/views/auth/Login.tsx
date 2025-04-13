import { appConfig } from "@/configs/app.config";
import { UserAuthForm } from "@/views/auth/components/UserAuthForm";
import { GoogleOAuthProvider } from "@react-oauth/google";


export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={appConfig.auth.googleClientId}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Simplified Product Development
        </h1>
        <p className="text-sm text-muted-foreground">
          Centralize all your team abilities and manage your product development at ease...
        </p>
      </div>
      <UserAuthForm />
    </GoogleOAuthProvider>
  )
}
