import { ResponseView } from "@/utils/dbTypes"
import { PostHeader } from "./PostHeader"
import { PostBody } from "./PostBody"
import { PostNlpTags } from "./PostNlpTags"
import { PostActionBar } from "./PostActionBar"

export const Post = ({ data }: { data: ResponseView }) => {
  return (
    <article 
      className="bg-neutral border border-base-content/8 overflow-hidden hover:border-base-content/20 transition-colors"
    >
      <PostHeader data={data} />
      <PostBody data={data} />
      <PostNlpTags
        sentiment={data.sentiment}
        emotion={data.emotion}
        irony={data.irony}
        hate_speech={data.hate_speech}
        offensive={data.offensive}
        topics={data.topics}
      />
      <PostActionBar
        score={data.score}
        num_comments={data.num_comments}
        permalink={data.permalink}
        author={data.author}
      />
    </article>
  )
}
