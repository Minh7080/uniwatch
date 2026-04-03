"use client";

import { createContext, useContext, useState } from "react";
import { ResponseView as Post } from "@/utils/dbTypes";
import { QueryPayload } from "../components/QuerySection/Sidebar/queryData";

type PostsContextType = {
  posts: {
    get: Post[] | null,
    set: React.Dispatch<React.SetStateAction<Post[] | null>>,
    append: (newPosts: Post[]) => void,
  }

  cursor: {
    get: string | null,
    set: React.Dispatch<React.SetStateAction<string | null>>;
  }

  isLoading: {
    get: boolean,
    set: React.Dispatch<React.SetStateAction<boolean>>;
  }

  queryPayload: {
    get: QueryPayload | null,
    set: React.Dispatch<React.SetStateAction<QueryPayload | null>>;
  }
};

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryPayload, setQueryPayload] = useState<QueryPayload | null>(null);

  const value: PostsContextType = {
    posts:        { get: posts, set: setPosts, append: (newPosts) => setPosts(prev => [...(prev ?? []), ...newPosts]) },
    cursor:       { get: cursor,       set: setCursor },
    isLoading:    { get: isLoading,    set: setIsLoading },
    queryPayload: { get: queryPayload, set: setQueryPayload },
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error("usePosts must be used within a PostsProvider")
  return context;
}
