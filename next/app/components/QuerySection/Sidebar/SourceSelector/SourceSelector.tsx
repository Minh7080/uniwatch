"use client"
import { Activity, useState } from "react";
import { Modal } from "../../../Modal"
import { useSubreddits } from "@/app/context/subreddits-context";
import { SubredditItem } from "./SubredditItem";
import { X } from "lucide-react";
import { FieldError, UseFormRegister, UseFormWatch } from "react-hook-form";
import { QueryData } from "../queryData";
import FieldErrorMessage from "../FieldErrorMessage";

type SourceSelectorProps = {
  register: UseFormRegister<QueryData>,
  watch: UseFormWatch<QueryData>,
  error: FieldError | undefined,
};

export const SourceSelector = ({ register, watch, error }: SourceSelectorProps) => {
  const [isSourceModalOpen, setSourceModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const subreddits = useSubreddits();
  const sources = watch("sources");

  return (
    <>
      {error && (<FieldErrorMessage message={error.message}/>)}
      <button type="button" className="btn btn-sm w-full cursor-pointer" onClick={() => setSourceModal(true)}>
        Subreddits ({sources ? sources.length : "0"}/{subreddits ? subreddits.length : "0"})
      </button>

      <Modal open={isSourceModalOpen} onClose={() => setSourceModal(false)}>
        <div className="bg-base-100 py-6 px-4 flex flex-col rounded-2xl w-[95vw] max-w-238 h-[90vh]">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between items-center pb-4 border-b">
            <h1 className="text-sm md:text-md lg:text-lg xl:text-xl font-bold">
              Subreddits ({sources ? sources.length : "0"}/{subreddits ? subreddits.length : "0"})
            </h1>
            <div className="flex gap-2 items-center ml-auto">
              <input type="text" className="input input-sm w-36 sm:w-48" placeholder="Search" onChange={e => setSearch(e.target.value)} />
              <button className="btn btn-circle btn-xs btn-error btn-ghost shrink-0" onClick={() => setSourceModal(false)}>
                <X />
              </button>
            </div>
            {error && (<FieldErrorMessage message={error.message}/>)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto flex-1 content-start">
            {
              subreddits?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                .map((x, idx) => (
                  <Activity
                    key={idx}
                    mode={!search || (x.id + x.name).toLowerCase().includes(search.toLowerCase().trim()) ? "visible" : "hidden"}
                  >
                    <label className="flex gap-4 items-center hover:bg-base-200 px-2 py-4 rounded-xl cursor-pointer">
                      <input
                        type="checkbox" className="size-4"
                        value={x.name}
                        {...register("sources")}
                      />
                      <SubredditItem subreddit={x} className="w-full" />
                    </label>
                  </Activity>
                ))
            }
          </div>
        </div>
      </Modal>
    </>
  )
}
