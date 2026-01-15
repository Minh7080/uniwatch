import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Children, cloneElement, type ReactElement } from 'react';
import { cn } from '@/lib/utils';

type DisableableElement = ReactElement<{ disabled?: boolean }>;

export type DisalableInputProps = {
  label: string,
  checked: boolean,
  onClick: () => void,
  children?: DisableableElement | DisableableElement[],
  className?: string,
};

export default function DisalableInput({
  label, checked, onClick, children, className
}: DisalableInputProps) {
  return (
    <SidebarMenuSubItem className='flex flex-col gap-4'>
      <Label className='text-sm'>
        <Checkbox
          checked={checked}
          onClick={onClick}
        />
        {label}
      </Label>

      <div className={cn(className)}>
        {children && Children.map(children, child => cloneElement(child, { disabled: !checked }))}
      </div>
    </SidebarMenuSubItem>
  );
};
