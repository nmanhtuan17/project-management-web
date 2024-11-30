import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {AvatarImage} from "@radix-ui/react-avatar";
import {getGravatar} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useParams} from "react-router-dom";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine
} from "@/components/ui/timeline.tsx";
import dayjs from "dayjs";  
import {Task, TaskActivity, TaskActivityType} from "@/types/task.ts";
import {SyntheticEvent} from "react";
import apiService from "@/services/api.service.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import { ProjectMember } from "@/types/project";
import TaskComment from "./TaskComment";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { useTaskDetailContext } from "../TaskDetail";

interface TaskCommentsProps {
  task: Task;
}

function ActivityItem({activity}: {activity: TaskActivity}) {
  const member = activity.member as ProjectMember;
  return <TimelineItem status="done">
    {activity.type === TaskActivityType.Update && (
      <TimelineHeading>
        {['type', 'title', 'status', 'priority'].includes(activity.field) && <>
          Updated task {activity.field} from{' '}
          <span className={'line-through'}>{activity.meta.oldValue}</span> to{' '}
          <span>{activity.meta.newValue}</span>
        </>}
      </TimelineHeading>
    )}
    <TimelineDot asChild>
      <Avatar className="h-5 w-5">
        <AvatarImage src={member?.user.avatar || getGravatar(member?.user.email)} alt="Avatar"/>
        <AvatarFallback>
          SR
        </AvatarFallback>
      </Avatar>
    </TimelineDot>
    <TimelineLine/>
    <TimelineContent className={'mr-0 pt-0 text-sm w-full flex flex-col -mt-4'}>
      {activity.type === TaskActivityType.Comment && (
        <TaskComment comment={activity.meta} activity={activity}/>
      )}
      {activity.type === TaskActivityType.Update && dayjs(activity.createdAt).format('MMMM D, YYYY h:mm A')}
    </TimelineContent>
  </TimelineItem>;
}

export default function TaskActivities(props: TaskCommentsProps) {
  const currentProject = useCurrentProject();
  const {taskId} = useParams();
  const {activities, loadActivities} = useTaskDetailContext();

  const postComment = async (event: SyntheticEvent) => {
    event.preventDefault();
    // const formData = new FormData(event.target as HTMLFormElement);
    // const data = Object.fromEntries(formData);
    // (event.target as HTMLFormElement).reset();
    // const response = await apiService.callApi('POST', `/projects/${currentProject._id}/tasks/${taskId}/comments`, data);
    // loadActivities();
  }

  return <>
    <Tabs defaultValue="comments" className="w-full">
      <TabsList>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
      </TabsList>
      <TabsContent value="comments">
        <Timeline positions="left">
          {activities?.filter(a => a.type === TaskActivityType.Comment).map(a => (
            <ActivityItem activity={a} key={a._id}/>
          ))}
        </Timeline>
        <form className={'flex flex-row'} onSubmit={postComment}>
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentProject?.profile.user.avatar} alt="Avatar"/>
            <AvatarFallback>
              {currentProject?.profile.user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className={'flex-1 space-y-2 flex flex-col items-end'}>
            <Textarea
              name={'text'}
              placeholder={'Add comment...'}
            />
            <Button size={'sm'} type={'submit'}>
              Comment
            </Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="activities">
        <Timeline positions="left">
          {activities?.filter(a => a.type !== TaskActivityType.Comment).map(a => (
            <ActivityItem activity={a} key={a._id}/>
          ))}
        </Timeline>
      </TabsContent>
    </Tabs>
  </>
}
