import { Separator } from "@/components/ui/separator"
import { ChangePasswordForm } from "@/views/setting/components/change-password/change-password-form"

export default function ChangePassword() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
  )
}