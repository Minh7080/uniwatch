import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react"
import { ResponseView } from "@/utils/dbTypes"
import { REDDIT_BASE, formatScore } from "./postUtils"

type Props = Pick<ResponseView, "score" | "num_comments" | "permalink" | "author">

export const PostActionBar = ({ score, num_comments, permalink, author }: Props) => {
  const href = permalink ? `${REDDIT_BASE}${permalink}` : undefined

  return (
    <div className="flex items-center gap-1 px-2 pb-2">
      {/* Vote pill */}
      <div className="flex items-center gap-1 bg-base-content/8 rounded-full px-2 py-1">
        <button
          onClick={e => e.stopPropagation()}
          className="text-base-content/50 hover:text-orange-400 transition-colors cursor-pointer"
          aria-label="Upvote"
        >
          <ArrowUp className="size-4" />
        </button>
        <span className="text-xs font-bold tabular-nums min-w-5 text-center">{formatScore(score)}</span>
        <button
          onClick={e => e.stopPropagation()}
          className="text-base-content/50 hover:text-blue-400 transition-colors cursor-pointer"
          aria-label="Downvote"
        >
          <ArrowDown className="size-4" />
        </button>
      </div>

      {/* Comments */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center gap-1.5 bg-base-content/8 hover:bg-base-content/12 rounded-full px-3 py-1 transition-colors"
      >
        <MessageSquare className="size-4 text-base-content/50" />
        <span className="text-xs font-medium text-base-content/60">{formatScore(num_comments)}</span>
      </a>

      {/* Author */}
      {author && (
        <span className="ml-auto text-xs text-base-content/35 truncate">u/{author}</span>
      )}
    </div>
  )
}
