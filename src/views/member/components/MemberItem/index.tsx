import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { cn } from "@/lib/utils"
import { loadProjectMembers } from "@/redux/actions/project.action"
import { useAppDispatch } from "@/redux/store"
import apiService from "@/services/api.service"
import { ProjectMember, ProjectRoles } from "@/types/project"
import { Ellipsis } from "lucide-react"
import { toast } from "sonner"

interface MemberItemProps {
  member: ProjectMember
}

export const MemberItem = ({ member }: MemberItemProps) => {
  const { currentProject } = useCurrentProject()
  const dispatch = useAppDispatch()

  const roles = {
    owner: "Chủ sở hữu",
    manager: 'Quản lý',
    member: "Nhân viên"
  }

  const handleUpdateRole = async (role: ProjectRoles) => {
    try {
      const res = await apiService.post(`projects/${currentProject._id}/members/${member._id}/role`, { role })
      dispatch(loadProjectMembers(currentProject._id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRemoveMember = async () => {
    try {
      const res = await apiService.delete(`projects/${currentProject._id}/members/${member._id}`, {})
      dispatch(loadProjectMembers(currentProject._id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-all duration-300 ">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={member.user.avatar} />
          <AvatarFallback>{member.user.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{member.user.fullName}</p>
          <p className="text-sm text-muted-foreground">{member.user.internalEmail}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={cn("text-sm font-semibold px-2 rounded-sm", member.role === ProjectRoles.OWNER ? 'bg-amber-300' : 'bg-muted')}>
          {roles[member.role]}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 outline-none">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Cập nhật quyền
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => handleUpdateRole(ProjectRoles.MANAGER)}
                    disabled={member.role === ProjectRoles.MANAGER}>Quản lý</DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleUpdateRole(ProjectRoles.MEMBER)}
                    disabled={member.role === ProjectRoles.MEMBER}>Nhân viên</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleRemoveMember}>Xóa thành viên</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}