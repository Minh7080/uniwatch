import { useId } from "react"
import { topics } from "./TopicsSelectionData"

function TopicItem({ name, value }: { name: string, value: string }) {
  const id = useId()

  return (
    <div className="flex items-start gap-2">
      <input
        name="topics"
        type="checkbox"
        id={id}
        value={value}
        className="size-4"
        defaultChecked
      />
      <label htmlFor={id} className="label text-sm hover:text-secondary">{name}</label>
    </div>
  )
}

export default function TopicSelection() {
  return (
    <div className="flex flex-col gap-2 pl-2">
      {topics.map((topic) => (
        <TopicItem key={topic.value} name={topic.name} value={topic.value} />
      ))}
    </div>
  )
}

export { TopicSelection };
