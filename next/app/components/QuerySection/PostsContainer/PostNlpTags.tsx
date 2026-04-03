import { ResponseView } from "@/utils/dbTypes"

const SENTIMENT_CLASS: Record<string, string> = {
  positive: "text-green-400 bg-green-400/10",
  negative: "text-red-400 bg-red-400/10",
  neutral: "text-base-content/50 bg-base-content/5",
}

const EMOTION_CLASS: Record<string, string> = {
  joy: "text-yellow-400 bg-yellow-400/10",
  sadness: "text-blue-400 bg-blue-400/10",
  anger: "text-red-500 bg-red-500/10",
  fear: "text-purple-400 bg-purple-400/10",
  surprise: "text-cyan-400 bg-cyan-400/10",
  disgust: "text-green-600 bg-green-600/10",
  neutral: "text-base-content/50 bg-base-content/5",
}

type Props = Pick<ResponseView, "sentiment" | "emotion" | "irony" | "hate_speech" | "offensive" | "topics">

export const PostNlpTags = ({ sentiment, emotion, irony, hate_speech, offensive, topics }: Props) => {
  const hasAny = sentiment || emotion || irony || hate_speech || offensive || (topics && topics.length > 0)
  if (!hasAny) return null

  return (
    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
      {sentiment && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SENTIMENT_CLASS[sentiment] ?? "text-base-content/50 bg-base-content/5"}`}>
          {sentiment}
        </span>
      )}
      {emotion && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EMOTION_CLASS[emotion] ?? "text-base-content/50 bg-base-content/5"}`}>
          {emotion}
        </span>
      )}
      {irony && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-base-content/50 bg-base-content/5">irony</span>
      )}
      {hate_speech && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-red-400 bg-red-400/10">hate speech</span>
      )}
      {offensive && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-orange-400 bg-orange-400/10">offensive</span>
      )}
      {topics?.map(topic => (
        <span key={topic} className="text-xs px-2 py-0.5 rounded-full text-base-content/40 bg-base-content/5">
          {topic.replace(/_/g, " ")}
        </span>
      ))}
    </div>
  )
}
