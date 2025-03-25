import { CheckIcon } from "@radix-ui/react-icons";
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
import { ETaskStatus, TaskPriority, TaskTypes } from "@/types/task.ts";
import { ArrowRightIcon, DocumentIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";

export const taskConfig = {
  types: [{
    icon: InfoIcon,
    value: TaskTypes.GENERAL,
    label: 'General'
  },
  {
    icon: BookOpenIcon,
    value: TaskTypes.ISSUE,
    label: 'Issue'
  }, {
    icon: BugIcon,
    value: TaskTypes.BUG,
    label: 'Bug'
  }],
  priorities: [{
    icon: ArrowUpIcon,
    value: TaskPriority.HIGH,
    label: 'Gấp'
  }, {
    icon: ArrowRightIcon,
    value: TaskPriority.MEDIUM,
    label: 'Trung bình'
  }, {
    icon: ArrowDownIcon,
    value: TaskPriority.LOW,
    label: 'Thấp'
  }],
  statuses: [{
    label: 'Chưa thực hiện',
    value: ETaskStatus.TODO,
    backgroundColor: '#cccccc',
    icon: ClockIcon
  }, {
    label: 'Đang xử lý',
    value: ETaskStatus.INPROCESS,
    backgroundColor: '#1c84c6',
    icon: PlaneTakeoff
  }, {
    label: 'Đã hoàn thành',
    value: ETaskStatus.DONE,
    backgroundColor: '#93c572',
    icon: SquareCheck
  }],
}

