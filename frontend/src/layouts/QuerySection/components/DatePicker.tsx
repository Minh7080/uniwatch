import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import formatDate from '@/lib/formatDate';

type DatePicker = {
  label: string;
  date?: Date;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
};

export default function DatePicker({ label, date, setDate }: DatePicker) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        size='lg' 
        className='flex justify-between'
        onClick={e => {
          setOpen(prev => !prev);
          e.stopPropagation();
        }}
      >
        <Label className='px-1'>
          {label}
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-50 justify-between font-normal'
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {date ? formatDate(date) : 'Select date'}
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
                setDate(date);
                setOpen(false);
              }}
              disabled={{
                before: new Date(2020, 0, 1),
                after: new Date(),
              }}
            />
          </PopoverContent>
        </Popover>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
