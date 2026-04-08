"use client"
import Sidebar from "./Sidebar/Sidebar";
import { PostsContainer } from "./PostsContainer/PostsContainer";
import { useState } from "react";

export default function QuerySection() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);

  return (
    <div className="mx-auto w-full max-w-280 flex gap-8">
      <div className={isSidebarCollapsed ? "hidden lg:block" : "block"}>
        <Sidebar />
      </div>
      <div
        className="fixed inset-0 bg-black/40 z-1 lg:hidden"
        hidden={isSidebarCollapsed}
        onClick={() => setSidebarCollapsed(true)}
      />
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <button className="btn w-full lg:hidden" onClick={() => setSidebarCollapsed(false)}>Filter</button>
        <PostsContainer />
      </div>
    </div>
  );
}

export { QuerySection }
