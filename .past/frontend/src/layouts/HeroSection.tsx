import FullLogo from '@/components/logo/FullLogo';

export default function HeroSection() {
  return (
    <div className='flex flex-col items-center mx-auto w-full gap-8 py-12 px-4'>
      <FullLogo />
      <div className='gap-4 flex flex-col items-center'>
        <h1 className='text-center font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-300'>
          <span 
            className='bg-linear-to-r from-red-500 to-orange-500 bg-clip-text 
            text-transparent'
          >
            Monitor and Search
          </span>
          <br />
          Australian university subreddits
        </h1>
        <p className='text-gray-400 text-center text-base w-full pt-2 max-w-200'>
          Uniwatch continuously collects public Reddit posts from Australian 
          university subreddits, allowing you to query discussions.
        </p>
      </div>
    </div>
  );
}
