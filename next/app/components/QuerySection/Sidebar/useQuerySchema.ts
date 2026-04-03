import { useSubreddits } from "@/app/context/subreddits-context";
import { createQuerySchema } from "./queryData";
import { topics } from "./TopicsSelectionData";
import { emotions } from "./EmotionsSelectionData";
import { sentiments } from "./SentimentsSelectionData";

export const useQuerySchema = () => {
  const subreddits = useSubreddits();

  return createQuerySchema({
    sourcesLength: subreddits?.length ?? 0,
    topicsLength: topics?.length ?? 0,
    emotionsLength: emotions?.length ?? 0,
    sentimentLength: sentiments?.length ?? 0,
  });
};
