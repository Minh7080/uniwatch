"use client";

import { createContext, useContext } from "react";
import { SubredditsTable as Subreddit } from "@/utils/dbTypes";

const SubredditsContext = createContext<Subreddit[] | null>([]);

export function SubredditsProvider({ children, subreddits }: { children: React.ReactNode; subreddits: Subreddit[] | null }) {
  return (
    <SubredditsContext.Provider value={subreddits}>
      {children}
    </SubredditsContext.Provider>
  );
}

export function useSubreddits() {
  return useContext(SubredditsContext);
}
