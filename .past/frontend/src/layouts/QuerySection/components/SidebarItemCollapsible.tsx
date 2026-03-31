import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';

import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@radix-ui/react-collapsible';

type SidebarItemCollapsibleProps = {
  label: string,
  children?: ReactNode,
  open: boolean,
  onClick: () => void,
  className?: string
}

export default function SidebarItemCollapsible({ label, children, open, onClick, className }: 
  SidebarItemCollapsibleProps) {
  return (
    <Collapsible open={open}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild className='group'>
          <SidebarMenuButton onClick={onClick}>
            {label}
            <ChevronRight
              className='transition-transform duration-200 group-data-[state=open]:rotate-90'
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent
          className='data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden'
        >
          <SidebarMenuSub className={className}>
            {children}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
