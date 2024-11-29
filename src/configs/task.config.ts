import {CheckIcon} from "@radix-ui/react-icons";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon, BookOpenIcon,
  BugIcon,
  ClockIcon,
  InfoIcon,
  PlaneTakeoff,
  SquareCheck, TriangleAlertIcon
} from "lucide-react";
import {TaskPriority, TaskTypes} from "@/types/task.ts";
import {ArrowRightIcon, DocumentIcon, ExclamationCircleIcon} from "@heroicons/react/16/solid";

export const taskConfig = {
  types: [{
    icon: InfoIcon,
    value: TaskTypes.GENERAL,
    label: 'General'
  }, {
    icon: CheckIcon,
    value: TaskTypes.TASK,
    label: 'Task'
  }, {
    icon: BugIcon,
    value: TaskTypes.BUG,
    label: 'Bug'
  }, {
    icon: TriangleAlertIcon,
    value: TaskTypes.INCIDENT,
    label: 'Incident'
  }, {
    icon: BookOpenIcon,
    value: TaskTypes.ISSUE,
    label: 'Issue'
  }],
  priorities: [{
    icon: ArrowUpIcon,
    value: TaskPriority.HIGH,
    label: 'High'
  }, {
    icon: ArrowRightIcon,
    value: TaskPriority.MEDIUM,
    label: 'Medium'
  }, {
    icon: ArrowDownIcon,
    value: TaskPriority.LOW,
    label: 'Low'
  }]
}
