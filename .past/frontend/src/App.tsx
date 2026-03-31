import { ThemeProvider } from '@/components/ui/theme-provider';
import MainPage from './pages/MainPage';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <MainPage/>
    </ThemeProvider>
  );
}

export default App;
