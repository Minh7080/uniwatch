import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarTrigger,
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
import SidebarItemCollapsible from './components/SidebarItemCollapsible';
import SearchButton from './components/SearchButton';
import DateRangesPresetSelect from './components/DateRangesPresetSelect';
import getDatePreset, { type setDatePresetInput } from './getDatePreset';
import MinMaxInput from './components/MinMaxInput';
import SliderInput from './components/SliderInput';

export default function QuerySidebar() {
  const [sourcesChecked, setSourcesChecked] = useState<Map<string, boolean>>(
    () => new Map(subreddits.map(sub => [sub.subreddit, true]))
  );

  const [openSections, setOpenSections] = useState({
    dateRanges: true,
    engagement: true,
    classification: true,
  });

  const [enableSections, setEnableSection] = useState({
    upvotes: false,
    comments: false,
    upvoteRatio: false,
  });

  const [dateRanges, setDateRanges] = useState<{ from?: Date, to?: Date }>({
    from: undefined,
    to: undefined,
  });

  const [dateSelect, setDateSelect] = useState<setDatePresetInput>('all');
  const [upvoteRatio, setUpvoteRatio] = useState<number>(0.5);

  return (
    <Sidebar contained>
      <SidebarHeader className='relative'>
        <SidebarTrigger className='absolute md:hidden' />
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
            open={openSections.dateRanges}
            onClick={() => setOpenSections(prev => ({ ...prev, dateRanges: !prev.dateRanges }))}
          >
            {dateRanges.to && dateRanges.from && dateRanges.to < dateRanges.from && (
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

            <SidebarMenuSubItem className='ml-2 flex justify-end'>
              <DateRangesPresetSelect
                value={dateSelect}
                onValueChange={value => {
                  setDateSelect(value);
                  setDateRanges(getDatePreset(value));
                }}
              />
            </SidebarMenuSubItem>

            {dateSelect === 'custom' && (
              <SidebarMenuSubItem className='ml-2 flex pt-4'>
                <DatePicker
                  label='From'
                  date={dateRanges.from}
                  onSelect={date => setDateRanges(prev => ({ ...prev, from: date }))}
                />
                <DatePicker
                  label='To'
                  date={dateRanges.to}
                  onSelect={date => setDateRanges(prev => ({ ...prev, to: date }))}
                />
              </SidebarMenuSubItem>
            )}
          </SidebarItemCollapsible>

          <SidebarItemCollapsible
            label='Engagement'
            open={openSections.engagement}
            onClick={() => setOpenSections(prev => ({ 
              ...prev, engagement: !prev.engagement 
            }))}
            className='flex flex-col gap-4'
          >
            <MinMaxInput 
              label='Number of Upvotes' 
              checked={enableSections.upvotes} 
              onClick={() => setEnableSection(prev => ({
                ...prev, upvotes: !enableSections.upvotes
              }))} 
            />

            <MinMaxInput 
              label='Number of Comments' 
              checked={enableSections.comments} 
              onClick={() => setEnableSection(prev => ({
                ...prev, comments: !enableSections.comments
              }))} 
            />

            <SliderInput 
              label='Upvote Ratio'
              checked={enableSections.upvoteRatio} 
              onClick={() => setEnableSection(prev => ({
                ...prev, upvoteRatio: !enableSections.upvoteRatio
              }))}
              value={upvoteRatio}
              setValue={setUpvoteRatio}
            />

          </SidebarItemCollapsible>

          <SidebarItemCollapsible
            label='Classification'
            open={openSections.classification}
            onClick={() => setOpenSections(prev => ({ 
              ...prev, classification: !prev.classification 
            }))}
            className='flex flex-col gap-4'
          >
            <header>hello</header>
            <header>hello</header>
            <header>hello</header>
            <header>hello</header>
            <header>hello</header>
          </SidebarItemCollapsible>

        </SidebarGroupCollapsible>

        <SidebarGroupCollapsible groupLabel='Sorts' defaultOpen>
        </SidebarGroupCollapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className='flex justify-between gap-4'>
          <Button variant='outline' className='hover:text-red-400 w-20'>Reset</Button>
          <SearchButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
