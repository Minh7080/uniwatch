import cn from "@/utils/cn";
import { useId } from "react";
import { cloneElement } from "react";
import { FieldError } from "react-hook-form";
import FieldErrorMessage from "./FieldErrorMessage";

type LabelProps = {
  labelText: string,
  children: React.ReactElement<{id?: string}>,
  className?: string,
  triggerChildren?: boolean,
  error: FieldError | undefined
};

export default function Label({ labelText, children, className, triggerChildren = true, error }: LabelProps) {
  const id = useId()
  return (
    <div className={cn("w-full", className)}>
      {error && (<FieldErrorMessage message={error.message}/>)}
      <
        label
        className="fieldset-legend text-xs flex flex-col gap-2 items-start w-full cursor-pointer"
        htmlFor={triggerChildren ? id : undefined}
      >
        {labelText}
      </label>
      {cloneElement(children, { id })}
    </div>
  );
};

export { Label, type LabelProps }
