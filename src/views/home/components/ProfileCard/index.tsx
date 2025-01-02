import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/redux/store"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const ProfileCard = () => {
  const { user } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  return (
    <Card className="w-[320px]">
      <CardContent className="flex flex-col items-center justify-center p-4 pb-0 mt-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatar} alt="@shadcn" />
          <AvatarFallback>{user?.avatar.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-lg mt-3">{user?.fullName}</p>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
        <Separator className="mt-2" />
        <Button
          onClick={() => {
            navigate('projects/setting/profile')
          }}
          variant="link"
          className="w-full">
          View profile
          <ArrowUpRight size={18} />
        </Button>
      </CardContent>
    </Card>
  )
}