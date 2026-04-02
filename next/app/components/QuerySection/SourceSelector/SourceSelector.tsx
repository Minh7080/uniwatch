"use client"
import { useState } from "react";
import { Modal } from "../../Modal"
import { useSubreddits } from "@/app/context/subreddits-context";
import { SubredditItem } from "./SubredditItem";

export const SourceSelector = () => {
  const [isSourceModalOpen, setSourceModal] = useState<boolean>(false);
  return (
    <>
      <button type="button" className="btn btn-sm w-full cursor-pointer" onClick={() => setSourceModal(true)}>Sources</button>

      <Modal open={isSourceModalOpen} onClose={() => setSourceModal(false)}>
        <div className="bg-base-100">
          <h1 className="text-3xl font-bold">Select University Subreddits</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {
              useSubreddits()?.map((x, idx) => (
                <SubredditItem key={idx} subreddit={x} />
              ))
            }
          </div>
        </div>
      </Modal>
    </>
  )
}
