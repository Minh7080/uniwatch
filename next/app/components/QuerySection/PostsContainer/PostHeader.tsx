import Image from "next/image"
import FileIcon from "@/public/file.svg"
import { ResponseView } from "@/utils/dbTypes"
import { REDDIT_BASE, timeAgo } from "./postUtils"
import { ExternalLink } from "lucide-react"

export const PostHeader = ({ data }: { data: ResponseView }) => {
  const subredditHref = `${REDDIT_BASE}/r/${data.subreddit_id}`
  const permalink = data.permalink ? `${REDDIT_BASE}${data.permalink}` : undefined

  return (
    <div className="flex items-center gap-2 px-3 pt-3 pb-2">
      <div className="size-6 rounded-full overflow-hidden shrink-0 ring-1 ring-base-content/10 bg-base-300">
        <Image
          src={data.subreddit_image_url || FileIcon}
          alt={`r/${data.subreddit_id}`}
          width={24} height={24}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex items-center gap-1 text-xs flex-wrap min-w-0">
        <a
          href={subredditHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="font-semibold text-base-content/90 hover:underline hover:text-secondary"
        >
          r/{data.subreddit_id}
        </a>
        <span className="text-base-content/30">·</span>
        <span className="text-base-content/45">{timeAgo(data.created_utc)}</span>
        {data.stickied && (
          <>
            <span className="text-base-content/30">·</span>
            <span className="text-green-500 font-medium">Pinned</span>
          </>
        )}
      </div>
      <div className="ml-auto flex gap-1 shrink-0">
        {data.over_18 && (
          <span className="text-xs font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">NSFW</span>
        )}
        {data.spoiler && (
          <span className="text-xs font-medium text-base-content/50 bg-base-content/8 px-1.5 py-0.5 rounded-full">Spoiler</span>
        )}
        {data.locked && (
          <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">Locked</span>
        )}
      </div>

      <a
        className="bg-base-content/8 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1 group cursor-pointer"
        href={permalink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
      >
        <ExternalLink size={16} />
        <span className="underline hidden group-hover:inline text-secondary">
          Source
        </span>
      </a>
    </div>
  )
}
