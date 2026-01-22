import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import QuerySidebar from './QuerySidebar';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { type queryType } from './queryType';

export default function QuerySection() {
  const [query, setQuery] = useState<queryType | undefined>(undefined);

  return (
    <Card className='relative mx-auto w-full max-w-300 h-200 overflow-hidden px-4'>
      <SidebarProvider>
        <QuerySidebar onQueryChange={setQuery} />
        <div>
          <SidebarTrigger />
          <div>
            {query ? (
              <pre className='text-xs overflow-auto'>
                {JSON.stringify(query, null, 2)}
              </pre>
            ) : (
              'No query yet'
            )}
          </div>
        </div>
      </SidebarProvider>
    </Card>
  );
}
