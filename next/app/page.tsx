export const dynamic = "force-dynamic";

import { Toaster } from "react-hot-toast";
import { Hero } from "./components/Hero"
import { QuerySection } from "./components/QuerySection/QuerySection"
import { getSubreddits } from "@/app/actions/getSubreddits";
import { SubredditsProvider } from "@/app/context/subreddits-context";
import { PostsProvider } from "@/app/context/posts-context";

export default async function Home() {
  const [subreddits, err] = await getSubreddits();
  if (err) console.error(err);

  return (
    <SubredditsProvider subreddits={subreddits}>
      <PostsProvider>
        <div>
          <div className="flex flex-col gap-12">
            <Hero />
            <QuerySection />
          </div>
          <Toaster />
        </div>
      </PostsProvider>
    </SubredditsProvider>
  );
}
