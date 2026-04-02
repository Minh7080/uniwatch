import { useId } from "react"

function SelectionItem({ topic, value, name }: { topic: string, value: string | number, name: string }) {
  const id = useId()

  return (
    <div className="flex items-start gap-2">
      <input
        name={name}
        type="checkbox"
        id={id}
        value={value}
        className="size-4"
        defaultChecked
      />
      <label htmlFor={id} className="label text-sm hover:text-secondary">{topic}</label>
    </div>
  )
}

type MultiSelectionProps = {
  list: { topic: string, value: string | number }[],
  name: string,
}

export default function MultiSelection({ list, name }: MultiSelectionProps) {
  return (
    <div className="flex flex-col gap-2 pl-2">
      {list.map((item, idx) => (
        <SelectionItem key={idx} topic={item.topic} value={item.value} name={name} />
      ))}
    </div>
  )
}

export { MultiSelection };
