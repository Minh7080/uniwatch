import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@radix-ui/react-collapsible';

import { subreddits } from './data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function QuerySidebar() {
  const [sourcesChecked, setSourcesChecked] = useState(
    () => Array(subreddits.length).fill(true)
  );

  return (
    <Sidebar contained>
      <SidebarHeader>
        <h3 className='text-center font-bold'>
          Query Posts
        </h3>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible>
          <SidebarGroup>
            <CollapsibleTrigger 
              className='flex items-center justify-between w-full group'
            >
              <SidebarGroupLabel>Sources</SidebarGroupLabel>
              <ChevronRight 
                className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90' 
              />
            </CollapsibleTrigger>
            <CollapsibleContent 
              className='data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden'
            >
              <SidebarGroupContent>
                <SidebarMenu>
                  {subreddits.map((subreddit, idx) => {
                    return (
                      <SidebarMenuItem key={idx}>
                        <SidebarMenuButton asChild>
                          <Label 
                            htmlFor={subreddit.subreddit}
                            className='flex items-start gap-3 cursor-pointer'
                          >
                            <Checkbox 
                              id={subreddit.subreddit}
                              checked={sourcesChecked[idx]}
                              onCheckedChange={checked =>
                                setSourcesChecked((prev) => {
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
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sorts</SidebarGroupLabel>
        </SidebarGroup>

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
