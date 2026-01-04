import {
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export type MinMaxInputProps = {
  label: string,
  checked: boolean,
  onClick: () => void,
};

export default function MinMaxInput({ label, checked, onClick }: MinMaxInputProps) {
  return (
    <SidebarMenuSubItem className='flex flex-col gap-4'>
      <Label className='text-sm'>
        <Checkbox
          checked={checked}
          onClick={onClick}
        />
        {label}
      </Label>
      <div className='flex gap-4'>
        <Input
          type='number'
          placeholder='Min'
          step={1}
          min={0}
          disabled={!checked}
        />

        <Input
          type='number'
          placeholder='Max'
          step={1}
          min={0}
          disabled={!checked}
        />
      </div>
    </SidebarMenuSubItem>
  );
};
