"use client"
import { usePosts } from "@/app/context/posts-context";
import { Post } from "./Post";

export const PostsContainer = () => {
  const { posts } = usePosts();
  return (
    <div className="w-full">
      {posts.get && (posts.get.map((post, idx) => (<Post key={idx} data={post} />)))}
    </div>
  )
}
