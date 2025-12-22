import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import QuerySidebar from './QuerySidebar';
import { Card } from '@/components/ui/card';

export default function QuerySection() {
  return (
    <Card className='relative mx-auto w-full max-w-375 h-200 overflow-hidden px-4'>
      <SidebarProvider>
        <QuerySidebar />
        <div>
          <SidebarTrigger />
          <div>h</div>
        </div>
      </SidebarProvider>
    </Card>
  );
}
