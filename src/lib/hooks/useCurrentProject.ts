import { loadKanbanBoard } from "@/redux/actions/project.action";
import { loadTasks } from "@/redux/actions/task.action";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { Project, ProjectMember, ProjectRoles, ProjectTypes } from "@/types/project";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ProjectWithProfile extends Project {
  profile?: ProjectMember;
}

const defaultProject: ProjectWithProfile = {
  _id: '',
  slug: '',
  name: '',
  avatar: '',
  type: ProjectTypes.TEAM,
  memberCount: 1,
  profile: {
    _id: "",
    user: undefined,
    project: "",
    role: ProjectRoles.MEMBER
  }
}

export default function useCurrentProject() {
  const { projects, members } = useAppSelector(state => state.project);
  const { user } = useAppSelector(state => state.auth)
  const [project, setProject] = useState<ProjectWithProfile>(defaultProject);
  const params = useParams();

  useEffect(() => {
    if (params.projectSlug) {
      const project = projects.find(s => s?.slug?.toLowerCase() === params.projectSlug)
      let profile;
      if (members.length > 0) {
        profile = members.find(member => member.user._id === user._id)
      }
      setProject({ ...project, profile })
    };
  }, [projects, params.projectSlug]);

  return project;
}
