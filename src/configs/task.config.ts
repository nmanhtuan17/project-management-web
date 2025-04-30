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
    label: 'Gấp',
    backgroundColor: '#ff5656'
  }, {
    icon: ArrowRightIcon,
    value: TaskPriority.MEDIUM,
    label: 'Trung bình',
    backgroundColor: '#ffb95cdb'
  }, {
    icon: ArrowDownIcon,
    value: TaskPriority.LOW,
    label: 'Thấp',
    backgroundColor: '#5c8bffdb'
  }],
  statuses: [{
    label: 'Chưa thực hiện',
    value: ETaskStatus.TODO,
    backgroundColor: '#cccccc',
    icon: ClockIcon,
    text: '#7d7d7d'
  }, {
    label: 'Đang xử lý',
    value: ETaskStatus.INPROCESS,
    backgroundColor: '#1c84c6',
    icon: PlaneTakeoff,
    text: '#007ac7'
  }, {
    label: 'Đã hoàn thành',
    value: ETaskStatus.DONE,
    backgroundColor: '#93c572',
    icon: SquareCheck,
    text: '#59bd17'
  }],
}

export const activitiesConfig = {
  status: {
    label: 'Trạng thái',
    value: {
      'to-do': 'Chưa thực hiện',
      'in-progress': 'Đang xử lý',
      'done': 'Đã hoàn thành'
    }
  },
  priority: {
    label: 'Độ ưu tiên',
    value: {
      1: 'Thấp',
      2: 'Trung bình',
      3: 'Gấp'
    }
  },
  type: {
    label: 'Phân loại',
    value: {
      'general': 'General',
      'issue': 'Issue',
      'bug': 'Bug'
    }
  }
}

