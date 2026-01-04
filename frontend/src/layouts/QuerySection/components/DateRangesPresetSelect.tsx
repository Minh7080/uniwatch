import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { setDatePresetInput } from '../getDatePreset';

type DateRangesPresetSelectProps = {
  value: setDatePresetInput,
  onValueChange: (value: setDatePresetInput) => void;
}

export default function DateRangesPresetSelect({ value, onValueChange }:
  DateRangesPresetSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Date ranges</SelectLabel>
          <SelectItem value='today'>Today</SelectItem>
          <SelectItem value='week'>This week</SelectItem>
          <SelectItem value='month'>This month</SelectItem>
          <SelectItem value='year'>This year</SelectItem>
          <SelectItem value='all'>All time</SelectItem>
          <SelectItem value='custom'>Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
