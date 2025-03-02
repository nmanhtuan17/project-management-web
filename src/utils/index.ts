import dayjs from "dayjs";

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');


export function getStartEndDateForProject(tasks: any[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

export const checkTimeExpiration = (time: { from: Date, to: Date }) => {
  const now = dayjs();
  const dueDate = dayjs(time.to);

  if (now.isAfter(dueDate)) {
    return { expired: true, remainingDays: 0 };
  }

  const remainingDays = dueDate.from(now);
  return { expired: false, remainingDays };
}