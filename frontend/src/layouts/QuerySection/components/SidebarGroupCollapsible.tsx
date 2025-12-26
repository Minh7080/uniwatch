import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';

import { ChevronRight } from 'lucide-react';

import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@radix-ui/react-collapsible';

import type { ReactNode } from 'react';

type SidebarGroupCollapsibleProp = {
  groupLabel: string,
  children?: ReactNode,
};

export default function SidebarGroupCollapsible(
  {groupLabel, children}: SidebarGroupCollapsibleProp
) {
  return (
    <Collapsible>
      <SidebarGroup>
        <CollapsibleTrigger 
          className='group'
        >
          <SidebarGroupLabel className='flex gap-1 hover:bg-sidebar-accent'>
            {groupLabel}
            <ChevronRight 
              className='transition-transform duration-200 group-data-[state=open]:rotate-90' 
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent 
          className='data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden'
        >
          <SidebarGroupContent>
            <SidebarMenu>
              {children}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
