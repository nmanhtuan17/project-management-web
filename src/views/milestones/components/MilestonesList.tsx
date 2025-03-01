import { useAppSelector } from "@/redux/store"

export const MilestonesList = () => {
  const { milestones } = useAppSelector(state => state.project)

  return (
    <div>
      {milestones.map(m => (
        <div key={m._id}>
          {m.title}
        </div>
      ))
      }
    </div>
  )
}