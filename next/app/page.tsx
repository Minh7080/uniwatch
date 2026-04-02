export const dynamic = "force-dynamic";

import { Hero } from "./components/Hero"
import { QuerySection } from "./components/QuerySection/QuerySection"

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <QuerySection />
    </div>
  );
}
