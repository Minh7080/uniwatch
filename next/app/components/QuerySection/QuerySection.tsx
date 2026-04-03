import { SubredditsProvider } from "@/app/context/subreddits-context";
import Sidebar from "./Sidebar/Sidebar";
import { getSubreddits } from "@/app/actions/getSubreddits";
import { PostsProvider } from "@/app/context/posts-context";
import { PostsContainer } from "./PostsContainer/PostsContainer";

export default async function QuerySection() {
  const [subreddits] = await getSubreddits();
  return (
    <SubredditsProvider subreddits={subreddits}>
      <PostsProvider>
        <div className="mx-auto w-280 flex justify-between gap-8">
          <Sidebar />
          <PostsContainer />
        </div>
      </PostsProvider>
    </SubredditsProvider>
  );
}

export { QuerySection }
