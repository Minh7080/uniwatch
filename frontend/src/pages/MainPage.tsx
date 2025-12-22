import LightDarkButton from '@/components/LightDarkButton';
import { Card } from '@/components/ui/card';
import HeroSection from '@/layouts/HeroSection';
import QuerySection from '@/layouts/QuerySection';

export default function MainPage() {
  return (
    <>
      <div className='text-right pt-8 px-24'>
        <LightDarkButton />
      </div>
      <HeroSection />
      <Card className='mx-0 md:mx-5 lg:mx-10 xl:mx-20'>
        <QuerySection />
      </Card>
    </>
  );
}
