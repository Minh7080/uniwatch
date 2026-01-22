import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectItem } from '@radix-ui/react-select';
import type { ReactElement } from 'react';

export type DateRangesPresetSelectProps = {
  value: string,
  onValueChange: (value: string) => void;
  label: string,
  children: ReactElement<typeof SelectItem> | ReactElement<typeof SelectItem>[];
  disabled?: boolean,
}

export default function PresetSelect({ value, onValueChange, label, children, disabled }:
  DateRangesPresetSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {children}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
