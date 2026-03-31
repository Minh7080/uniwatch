import LightDarkButton from '@/components/LightDarkButton';
import HeroSection from '@/layouts/HeroSection';
import QuerySection from '@/layouts/QuerySection/QuerySection';

export default function MainPage() {
  return (
    <>
      <div className='text-right pt-8 px-6 md:px-12 lg:px-24'>
        <LightDarkButton />
      </div>
      <HeroSection />
      <QuerySection />
      <div className='pb-16'></div>
    </>
  );
}
