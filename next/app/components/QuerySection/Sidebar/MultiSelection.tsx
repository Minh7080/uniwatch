import { useId } from "react"
import { UseFormRegister, FieldPath } from "react-hook-form"
import { QueryData } from "./queryData"

type SelectionItemProps = {
  topic: string | number,
  value: string | number,
  name: FieldPath<QueryData>,
  register: UseFormRegister<QueryData>
}

function SelectionItem({ topic, value, name, register }: SelectionItemProps) {
  const id = useId()

  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id={id}
        value={value}
        className="size-4 cursor-pointer"
        {...register(name)}
      />
      <label htmlFor={id} className="label text-sm hover:text-secondary cursor-pointer">{topic}</label>
    </div>
  )
}

type MultiSelectionProps = {
  list: { topic: string, value: string | number }[],
  name: FieldPath<QueryData>,
  register: UseFormRegister<QueryData>
}

export default function MultiSelection({ list, name, register }: MultiSelectionProps) {
  return (
    <div className="flex flex-col gap-2 pl-2">
      {list.map((item, idx) => (
        <SelectionItem key={idx} topic={item.topic} value={item.value} name={name} register={register} />
      ))}
    </div>
  )
}

export { MultiSelection };
