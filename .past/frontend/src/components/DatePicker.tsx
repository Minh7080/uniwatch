import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useState } from 'react';
import formatDate from '@/lib/formatDate';

type DatePickerProps = {
  label: string,
  date?: Date,
  onSelect: (date?: Date) => void,
};

export default function DatePicker({ label, date, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Label className='px-1 flex flex-col items-start'>
      {label}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-30 justify-between font-normal'
          >
            {date ? formatDate(date) : 'None'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='w-auto overflow-hidden p-0'
          align='start'
          onClick={e => e.stopPropagation()}
        >
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            onSelect={date => {
              // setDate(date);
              onSelect(date);
              setOpen(false);
            }}
            disabled={{
              before: new Date(2020, 0, 1),
              after: new Date(),
            }}
          />
        </PopoverContent>
      </Popover>
    </Label>
  );
}
