import { SubredditsProvider } from "@/app/context/subreddits-context";
import Sidebar from "./Sidebar";
import { getSubreddits } from "@/app/actions";
import { PostsProvider } from "@/app/context/posts-context";

export default async function QuerySection() {
  const [subreddits] = await getSubreddits();
  return (
    <SubredditsProvider subreddits={subreddits}>
      <PostsProvider>
        <div className="mx-auto w-300 flex">
          <Sidebar />
        </div>
      </PostsProvider>
    </SubredditsProvider>
  );
}

export { QuerySection }
