import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';

import { ChevronRight } from 'lucide-react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@radix-ui/react-collapsible';

type SidebarItemCollapsibleProps = {
  label: string,
  children?: ReactNode,
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarItemCollapsible({ label, children, open, setOpen }: 
  SidebarItemCollapsibleProps) {
  return (
    <Collapsible open={open}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild className='group'>
          <SidebarMenuButton onClick={() => setOpen(prev => !prev)}>
            {label}
            <ChevronRight
              className='transition-transform duration-200 group-data-[state=open]:rotate-90'
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent
          className='data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden'
        >
          <SidebarMenuSub>
            {children}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
