"use client";

import { createContext, useContext, useState } from "react";
import { ResponseView as Post } from "@/utils/dbTypes";

type PostsContextType = {
  posts: {
    get: Post[] | null,
    set: React.Dispatch<React.SetStateAction<Post[] | null>>,
  }

  cursor: {
    get: string | null,
    set: React.Dispatch<React.SetStateAction<string | null>>;
  }

  isLoading: {
    get: boolean,
    set: React.Dispatch<React.SetStateAction<boolean>>;
  }
};

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value: PostsContextType = {
    posts:     { get: posts,     set: setPosts },
    cursor:    { get: cursor,    set: setCursor },
    isLoading: { get: isLoading, set: setIsLoading },
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
