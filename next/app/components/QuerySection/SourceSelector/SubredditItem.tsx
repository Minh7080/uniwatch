import type { SubredditsTable as Subreddit } from "@/utils/dbTypes"
import Image from "next/image"
import Window from "@/public/file.svg"

export const SubredditItem = ({ subreddit }: {subreddit: Subreddit | null}) => {
  if (!subreddit) return;
  return (
    <div>
      <p>{`r/${subreddit.id}`}</p>
      <p>{subreddit.name}</p>
      <Image src={!!subreddit.image_url? subreddit.image_url :  Window} alt={`${subreddit.name} subreddit icon`} width={20} height={20} />
    </div>
  )
}
