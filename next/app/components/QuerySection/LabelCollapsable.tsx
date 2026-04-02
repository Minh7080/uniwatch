"use client"
import { cn } from "@/utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Activity, useId, useState } from "react";
import { cloneElement } from "react";

type LabelCollapsableProps = {
  labelText: string,
  children: React.ReactElement<{ id?: string }>,
  className?: string,
  triggerChildren?: boolean,
  defaultCollapse?: boolean,
};

export default function LabelCollapsable({ labelText, children, className, triggerChildren = true, defaultCollapse = false }: LabelCollapsableProps) {
  const id = useId()
  const [isCollapse, setCollapse] = useState<boolean>(defaultCollapse);
  return (
    <div className={cn("w-full", className)}>
      <
        label
        className="fieldset-legend text-xs w-full"
        htmlFor={triggerChildren ? id : undefined}
        onClick={e => {
          e.preventDefault();
          setCollapse(prev => !prev);
        }}
      >
        {labelText}
        {
          isCollapse
          ? <ChevronDown size={16}/>
          : <ChevronUp size={16}/>
        }
      </label>
      <Activity mode={isCollapse ? 'hidden' : 'visible'}>
        {cloneElement(children, { id })}
      </Activity>
    </div>
  );
};

export { LabelCollapsable, type LabelCollapsableProps }
