import type { SubredditsTable as Subreddit } from "@/utils/dbTypes"
import Image from "next/image"
import Window from "@/public/file.svg"
import cn from "@/utils/cn";

type SubredditItemProps = {
  subreddit: Subreddit | null,
  className?: string,
};

export const SubredditItem = ({ subreddit, className }: SubredditItemProps) => {
  if (!subreddit) return;
  return (
    <div className={cn("flex gap-2 items-center h-10", className)}>
      <div className="size-8 rounded-full overflow-hidden shrink-0">
        <Image 
          className="object-cover w-full h-full"
          src={!!subreddit.image_url ? subreddit.image_url : Window} 
          alt={`${subreddit.name} subreddit icon`} 
          width={20} height={20} 
        />
      </div>
      <div>
        <a className="link label text-xs hover:text-secondary" href={subreddit.subreddit_url} target="_blank" rel="noopener noreferrer">{`r/${subreddit.id}`}</a>
        <p className="text-sm">{subreddit.name}</p>
      </div>
    </div>
  )
}
