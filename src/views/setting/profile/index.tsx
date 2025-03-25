import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
        <p className="text-sm text-muted-foreground">
          Đây là cách người khác sẽ nhìn thấy bạn trên trang web
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}