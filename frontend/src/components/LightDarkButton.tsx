import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ui/theme-provider';


export default function LightDarkButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button 
      variant='outline' 
      size='icon-lg' 
      className='rounded-full'
      onClick={() => {
        if (theme === 'light') setTheme('dark');
        else {setTheme('light');}
      }}
    >
      {
        theme === 'light'
        ? <Moon/>
        : <Sun />
      }
    </Button>
  );
};
