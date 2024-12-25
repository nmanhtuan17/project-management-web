import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProjectMember, ProjectRoles } from "@/types/project"
import { Ellipsis } from "lucide-react"

interface MemberItemProps {
  member: ProjectMember
}

export const MemberItem = ({ member }: MemberItemProps) => {

  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-all duration-300 ">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={member.user.avatar} />
          <AvatarFallback>{member.user.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{member.user.fullName}</p>
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={cn("text-sm font-semibold px-2 rounded-sm", member.role === ProjectRoles.OWNER ? 'bg-amber-300' : 'bg-muted')}>
          {member.role}
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            console.log(123)
          }}
        >
          <Ellipsis size={18} />
        </Button>
      </div>
    </div>
  )
}