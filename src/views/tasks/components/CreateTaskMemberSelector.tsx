import { MultiSelect, MultiSelectAssignees } from "@/components/ui/multi-select.tsx";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { ProjectMember } from "@/types/project";
import { useAppSelector } from "@/redux/store";

interface MemberSelectorProps {
  members: string[];
  className?: string;
  onChange?: (members: string[]) => void,
}

export default function CreateTaskMemberSelector(props: MemberSelectorProps) {
  const currentProject = useCurrentProject();
  const {members} = useAppSelector(state => state.project)


  return <MultiSelectAssignees
    placeholder="Search member..."
    className={props.className}
    selected={props.members || []}
    options={members.map(mem => ({
      label: <div className={'flex items-center gap-2'}>
        <Avatar className={'w-4 h-4'}>
          <AvatarImage src={mem?.user?.avatar} />
          <AvatarFallback className="text-xs">{mem.user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        {mem.user.fullName}
      </div>,
      value: mem._id,
    }))}
    onChange={(selected: string[]) => {
      if (props.onChange) props.onChange(selected);
    }}
  />
}
