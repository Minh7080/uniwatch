"use client"
import { useEffect, useRef, useCallback } from "react";
import { usePosts } from "@/app/context/posts-context";
import { query } from "@/app/actions/query";
import { Post } from "./Post";

export const PostsContainer = () => {
  const { posts, cursor, isLoading, queryPayload } = usePosts();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!cursor.get || isLoading.get || !queryPayload.get) return;
    isLoading.set(true);
    const [result, err] = await query(queryPayload.get, cursor.get);
    if (err) {
      console.error(err);
    } else if (result) {
      posts.append(result.data);
      cursor.set(result.nextCursor);
    }
    isLoading.set(false);
  }, [cursor.get, isLoading.get, queryPayload.get]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full min-w-0 rounded-lg overflow-clip">
      {posts.get && posts.get.map((post, idx) => <Post key={idx} data={post} />)}
      {isLoading.get && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
};
