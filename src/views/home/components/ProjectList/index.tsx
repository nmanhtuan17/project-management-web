import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { Project, ProjectTypes } from "@/types/project"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { loadMilestones } from "@/redux/actions/project.action"
import { useNavigate } from "react-router-dom"
import { loadKanbanBoard } from "@/redux/actions/project.action"
import { resetFilter } from "@/redux/slices/task.slice"
import apiService from "@/services/api.service"
import { Button } from "@/components/ui/button"
import { PlusIcon, Search } from "lucide-react"
import { useDialogContext } from "@/components/providers/DialogProvider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ProjectListProps {
}

export const ProjectList = ({ }: ProjectListProps) => {
  const { projects } = useAppSelector(state => state.project)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { setCurrentProject, setProfile } = useCurrentProject()
  const { setDialogOpen } = useDialogContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [projectType, setProjectType] = useState<ProjectTypes | "all">("all")

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = projectType === "all" || project.type === projectType
    return matchesSearch && matchesType
  })

  const onSelectProject = async (project: Project) => {
    dispatch(loadKanbanBoard(project._id))
    dispatch(loadMilestones({ projectId: project._id, filter: { query: '' } }))
    dispatch(resetFilter())
    setCurrentProject(project)
    const profile = await apiService.getProjectProfile(project._id)
    setProfile(profile)
    navigate(`/projects/${project.slug}/overview`)
  }

  return <Card className="flex flex-col flex-1">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <p>Danh sách dự án</p>
        <div>
          <Button variant="outline" onClick={() => {
            setDialogOpen('createProject', true)
          }}>
            <PlusIcon className="w-4 h-4" />
            Thêm dự án
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 gap-4 overflow-y-auto">
      <div className="flex gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 outline-none focus-visible:ring-0 w-48"
          />
        </div>
        <Select value={projectType} onValueChange={(value: ProjectTypes | "all") => setProjectType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại dự án" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={ProjectTypes.PERSONAL}>Cá nhân</SelectItem>
            <SelectItem value={ProjectTypes.TEAM}>Nhóm</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên dự án</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Số thành viên</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {filteredProjects.map((project) => (
              <TableRow key={project._id} className="cursor-pointer" onClick={() => onSelectProject(project)}>
                <TableCell className="font-medium hover:underline flex items-center">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage
                      src={project.avatar || `https://avatar.vercel.sh/${project?.name}.png`}
                      alt={project?.name}
                    />
                    <AvatarFallback>{project?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{project.name}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={project.type === 'personal' ? 'secondary' : 'default'}>
                    {project.type === 'personal' ? 'Cá nhân' : 'Nhóm'}
                  </Badge>
                </TableCell>
                <TableCell>{project.memberCount || 0}</TableCell>
                <TableCell>
                  {project.createdAt ? format(new Date(project.createdAt), 'dd/MM/yyyy') : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
}
