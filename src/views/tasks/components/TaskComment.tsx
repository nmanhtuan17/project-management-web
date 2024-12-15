import { Link } from "react-router-dom";
import { DotIcon, EllipsisVerticalIcon, PencilIcon } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button.tsx";
import { FaceIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import apiService from "@/services/api.service.ts";
import { TaskActivity, Comment } from "@/types/task.ts";
import { ProjectMember } from "@/types/project";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

interface TaskCommentProps {
  comment: Comment;
  activity: TaskActivity;
}

export default function TaskComment({ comment, activity }: TaskCommentProps) {
  const { currentProject } = useCurrentProject();
  const deleteComment = async (commentId: string) => {
    await apiService.callApi('DELETE', `/comments/${commentId}`);
  }
  const member = activity.member as ProjectMember;

  return <div className={'flex-1 pl-3 pr-1 pt-1 pb-2.5 bg-muted rounded-xl'}>
    <div className={'flex flex-row gap-1 items-center justify-between'}>
      <div className={'flex flex-row items-center text-sm space-x-1'}>
        <Link
          to={`/projects/${currentProject.slug}/members/${member._id}`}
          className={'underline-offset-2 hover:underline font-semibold text-foreground'}
        >
          {member?.user.fullName || "Anonymous Member"}
        </Link>
        <span className={'text-muted-foreground'}>{member.role || "Member"}</span>
        <DotIcon className={'w-3 h-3 text-muted-foreground'} />
        {/* <span className={'text-muted-foreground'}>{dayjs(comment.createdAt).fromNow()}</span> */}
      </div>
      <div>
        <Button variant={'ghost'} className={'w-6 h-6 p-0 hover:border'}>
          <FaceIcon className={'w-3 h-3'} />
        </Button>
        <Button variant={'ghost'} className={'w-6 h-6 p-0 hover:border'}>
          <PencilIcon className={'w-3 h-3'} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={'ghost'} className={'w-6 h-6 p-0 hover:border'}>
              <EllipsisVerticalIcon className={'w-3 h-3'} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={'text-destructive'} onSelect={() => deleteComment(comment._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className={'text-sm'}>
      {comment.text}
    </div>
  </div>
}
