import { useSubreddits } from "@/app/context/subreddits-context";
import { createQuerySchema } from "./queryData";

export const useQuerySchema = () => {
  const subreddits = useSubreddits();

  return createQuerySchema({
    sourcesLength: subreddits?.length ?? 0,
  });
};
