import { FullLogo } from "./FullLogo"

export default function Hero() {
  return (
    <div className="gap-4 flex flex-col items-center py-12 px-4">
      <FullLogo />
      <h1 className="text-center font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-300">
        <span
          className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text 
          text-transparent"
        >
          Monitor and Search
        </span>
        <br />
        Australian and New Zealand
        <br />
        university subreddits
      </h1>
      <p className="text-gray-400 text-center text-base w-full pt-2 max-w-200">
        Uniwatch continuously collects public Reddit posts from Australian
        and New Zealand university subreddits, allowing you to query discussions.
      </p>
    </div>
  );
}

export { Hero }
