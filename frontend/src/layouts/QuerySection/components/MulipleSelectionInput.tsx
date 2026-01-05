import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Children, cloneElement, type ReactElement } from 'react';

type DisableableElement = ReactElement<{ disabled?: boolean }>;

export type MultipleSelectionInputProps = {
  label: string,
  checked: boolean,
  onClick: () => void,
  children: DisableableElement | DisableableElement[];
};

export default function MultipleSelectionInput({ label, checked, onClick, children }:
  MultipleSelectionInputProps) {
  return (
    <SidebarMenuSubItem className='flex flex-col gap-4'>
      <Label className='text-sm'>
        <Checkbox
          checked={checked}
          onClick={onClick}
        />
        {label}
      </Label>
      <div className='flex flex-wrap gap-2 justify-center'>
        {Children.map(children, child => cloneElement(child, { disabled: !checked }))}
      </div>
    </SidebarMenuSubItem>
  );
};
