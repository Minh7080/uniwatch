import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { subreddits } from './data';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import SidebarGroupCollapsible from './components/SidebarGroupCollapsible';
import DatePicker from './components/DatePicker';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';

export default function QuerySidebar() {
  const [sourcesChecked, setSourcesChecked] = useState(
    () => Array(subreddits.length).fill(true)
  );
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

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
          {sourcesChecked.every(x => x === false) && (
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
              <SidebarMenuButton>
                <Label
                  htmlFor={subreddit.subreddit}
                  className='flex items-start gap-3 cursor-pointer'
                >
                  <Checkbox
                    id={subreddit.subreddit}
                    checked={sourcesChecked[idx]}
                    onCheckedChange={checked =>
                      setSourcesChecked(prev => {
                        const copy = [...prev];
                        copy[idx] = checked === true;
                        return copy;
                      })
                    }
                  />
                  {`r/${subreddit.subreddit}`}
                </Label>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroupCollapsible>

        <SidebarGroupCollapsible groupLabel='Filters'>
          {toDate && fromDate && toDate < fromDate && (
            <SidebarMenuItem>
              <Alert variant='destructive' className='my-2'>
                <AlertCircleIcon />
                <AlertTitle>
                  To date must be after From date
                </AlertTitle>
              </Alert>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem className='flex justify-center'>
            <ButtonGroup>
              <Button variant='outline' onClick={() => setDatePreset('today')}>Today</Button>
              <Button variant='outline' onClick={() => setDatePreset('week')}>This Week</Button>
            </ButtonGroup>
          </SidebarMenuItem>

          <SidebarMenuItem className='flex justify-center'>
            <ButtonGroup>
              <Button variant='outline' onClick={() => setDatePreset('month')}>This Month</Button>
              <Button variant='outline' onClick={() => setDatePreset('year')}>This Year</Button>
              <Button variant='outline' onClick={() => setDatePreset('all')}>All Time</Button>
            </ButtonGroup>
          </SidebarMenuItem>


          <DatePicker label='From' date={fromDate} setDate={setFromDate} />
          <DatePicker label='To' date={toDate} setDate={setToDate} />
        </SidebarGroupCollapsible>

        <SidebarGroupCollapsible groupLabel='Sorts'>
        </SidebarGroupCollapsible>

      </SidebarContent>

      <SidebarFooter>
        <div className='flex justify-between gap-4'>
          <Button variant='outline' className='hover:text-red-400'>Clear</Button>
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
