import FullLogo from '@/components/logo/FullLogo';

export default function HeroSection() {
  return (
    <div className='flex flex-col items-center mx-auto w-250 gap-8 py-24'>
      <FullLogo />
      <div className='gap-4 flex flex-col items-center'>
        <h1 className='text-center font-bold text-6xl'>
          <span 
            className='bg-linear-to-r from-red-500 to-orange-500 bg-clip-text 
            text-transparent'
          >
            Monitor and Search
          </span>
          <br />
          Australian university subreddits
        </h1>
        <p className='text-gray-400 text-center text-lg w-200'>
          Uniwatch continuously collects public Reddit posts from Australian 
          university communities, allowing you to query discussions.
        </p>
      </div>
    </div>
  );
}
