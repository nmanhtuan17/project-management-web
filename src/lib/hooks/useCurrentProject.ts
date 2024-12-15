import { Project, ProjectMember, ProjectRoles, ProjectTypes } from '@/types/project';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CurrentProjectState {
  currentProject: Project;
  profile: ProjectMember;
  setCurrentProject: (project: Project) => void;
  setProfile: (profile: ProjectMember) => void;
  reset: () => void;
}


const defaultProject: Project = {
  _id: '',
  slug: '',
  name: '',
  avatar: '',
  type: ProjectTypes.TEAM,
  memberCount: 1,

}

const defaultProfile: ProjectMember = {
  _id: "",
  user: undefined,
  project: "",
  role: ProjectRoles.MEMBER
}

export const useCurrentProject = create<CurrentProjectState>()(
  persist((set, get) => ({
    currentProject: defaultProject,
    profile: defaultProfile,
    setCurrentProject: (project) => {
      set(() => ({ currentProject: project }))
    },
    setProfile: (profile) => {
      set(() => ({ profile }))
    },
    reset: () => {
      set(() => ({
        currentProject: defaultProject,
        profile: defaultProfile
      }))
      localStorage.removeItem('current-project')
    }
  }),
    {
      name: 'current-project'
    }
  )
)

