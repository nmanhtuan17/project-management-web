import { useAppSelector } from "@/redux/store.ts";
import { Project, ProjectMember, ProjectRoles, ProjectTypes } from "@/types/project";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const defaultProject: Project = {
  _id: '',
  slug: '',
  name: '',
  avatar: '',
  type: ProjectTypes.TEAM,
  memberCount: 1,
}

export default function useCurrentSpace() {
  const { projects } = useAppSelector(state => state.project);
  const [project, setProject] = useState<Project>(defaultProject);
  const params = useParams();

  useEffect(() => {
    if (params.projectSlug) setProject(projects.find(s => s?.slug?.toLowerCase() === params.projectSlug));
  }, [projects, params.projectSlug]);

  return project;
}
