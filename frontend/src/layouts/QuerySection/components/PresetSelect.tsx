import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { setDatePresetInput } from '../getDatePreset';
import { SelectItem } from '@radix-ui/react-select';
import type { ReactElement } from 'react';

export type DateRangesPresetSelectProps = {
  value: setDatePresetInput,
  onValueChange: (value: string) => void;
  label: string,
  children: ReactElement<typeof SelectItem> | ReactElement<typeof SelectItem>[];
}

export default function PresetSelect({ value, onValueChange, label, children }:
  DateRangesPresetSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
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
