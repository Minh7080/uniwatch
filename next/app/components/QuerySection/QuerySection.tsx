import { SubredditsProvider } from "@/app/context/subreddits-context";
import Sidebar from "./Sidebar";
import { getSubreddits } from "@/app/actions";

export default async function QuerySection() {
  const [subreddits] = await getSubreddits();
  return (
    <SubredditsProvider subreddits={subreddits}>
      <div className="mx-auto w-300 flex">
        <Sidebar />
      </div>
    </SubredditsProvider>
  );
}

export { QuerySection }
