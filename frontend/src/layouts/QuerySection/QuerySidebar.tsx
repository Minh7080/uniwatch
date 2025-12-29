import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { subreddits } from './data';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import SidebarGroupCollapsible from './components/SidebarGroupCollapsible';
import DatePicker from '../../components/DatePicker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import SidebarItemCollapsible from './components/SidebarItemCollapsible';

export default function QuerySidebar() {
  const [sourcesChecked, setSourcesChecked] = useState<Map<string, boolean>>(
    () => new Map(subreddits.map(sub => [sub.subreddit, true]))
  );
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const [openDateRanges, setOpenDateRanges] = useState<boolean>(true);

  const setDatePreset = (input: 'today' | 'week' | 'month' | 'year' | 'all') => {
    switch (input) {
      case 'today':
        setFromDate(new Date());
        setToDate(new Date());
        break;
      case 'week': {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        setFromDate(fromDate);
        setToDate(new Date());
        break;
      }
      case 'month': {
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        setFromDate(fromDate);
        setToDate(new Date());
        break;
      }
      case 'year': {
        const fromDate = new Date();
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        setFromDate(fromDate);
        setToDate(new Date());
        break;
      }
      case 'all':
        setFromDate(undefined);
        setToDate(undefined);
        break;
    }
  };

  return (
    <Sidebar contained>
      <SidebarHeader>
        <h3 className='text-center font-bold'>
          Query Posts
        </h3>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupCollapsible groupLabel='Sources'>
          {Array.from(sourcesChecked.values()).every(x => x === false) && (
            <SidebarMenuItem>
              <Alert variant='destructive' className='my-2'>
                <AlertCircleIcon />
                <AlertTitle>
                  At least one source must be selected
                </AlertTitle>
              </Alert>
            </SidebarMenuItem>
          )}
          {subreddits.map((subreddit, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton
                onClick={() => setSourcesChecked(prev => {
                  const copy = new Map(prev);
                  copy.set(subreddit.subreddit, !prev.get(subreddit.subreddit));
                  return copy;
                })}>
                <Label
                  className='flex items-start gap-3'
                >
                </Label>
                <Checkbox
                  checked={sourcesChecked.get(subreddit.subreddit)}
                />
                {`r/${subreddit.subreddit}`}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroupCollapsible>

        <SidebarGroupCollapsible groupLabel='Filters' defaultOpen>
          <SidebarItemCollapsible 
            label='Date ranges' 
            open={openDateRanges} 
            setOpen={setOpenDateRanges}
          >
            {toDate && fromDate && toDate < fromDate && (
              <SidebarMenuSubItem>
                <Alert variant='destructive' className='my-2'>
                  <AlertCircleIcon />
                  <AlertTitle>
                    Invalid date range
                  </AlertTitle>
                  <AlertDescription>
                    <p>The 'To' date cannot be earlier than the 'From' date.</p>
                  </AlertDescription>
                </Alert>
              </SidebarMenuSubItem>
            )}
            <SidebarMenuSubItem className='flex justify-center'>
              <ButtonGroup>
                <Button variant='outline' onClick={() => setDatePreset('today')}>Today</Button>
                <Button variant='outline' onClick={() => setDatePreset('week')}>This Week</Button>
              </ButtonGroup>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem className='flex justify-center'>
              <ButtonGroup>
                <Button variant='outline' onClick={() => setDatePreset('month')}>This Month</Button>
                <Button variant='outline' onClick={() => setDatePreset('year')}>This Year</Button>
                <Button variant='outline' onClick={() => setDatePreset('all')}>All Time</Button>
              </ButtonGroup>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem className='ml-2'>
              <DatePicker label='From' date={fromDate} setDate={setFromDate} />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem className='ml-2'>
              <DatePicker label='To' date={toDate} setDate={setToDate} />
            </SidebarMenuSubItem>
          </SidebarItemCollapsible>

        </SidebarGroupCollapsible>

        <SidebarGroupCollapsible groupLabel='Sorts' defaultOpen>
        </SidebarGroupCollapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className='flex justify-between gap-4'>
          <Button variant='outline' className='hover:text-red-400 w-20'>Clear</Button>
          <Button
            variant='outline'
            className='
            grow
            relative
            overflow-hidden
            bg-linear-to-r
            from-red-500/50 to-orange-500/50
            before:absolute
            before:inset-0
            before:bg-linear-to-r
            before:from-red-500
            before:to-orange-500
            before:opacity-0
            enabled:hover:before:opacity-100
            before:transition-opacity
            before:duration-300
            '
          >
            <span className='relative z-10'>Search</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
