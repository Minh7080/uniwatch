"use client"
import { Label } from "./Label";
import { DateRanges } from "./DateRanges";
import { TopicSelection } from "./TopicsSelection";
import { LabelCollapsable } from "./LabelCollapsable";

export default function Sidebar() {
  return (
    <form className="bg-neutral rounded-lg flex-col gap-4 w-xs px-2 py-4 hidden md:flex">
      <button type="button" className="btn btn-sm w-full">Sources</button>
      <Label labelText="Sort by">
        <select className="select select-sm" defaultValue="new">
          <option value="new">New</option>
          <option value="hot">Hot</option>
          <option value="top">Top</option>
          <option value="controversial">Controversial</option>
        </select>
      </Label>
      <Label labelText="Search">
        <input type="text" className="input input-sm" placeholder="Search term" />
      </Label>
      <Label labelText="Date range">
        <DateRanges />
      </Label>
      <LabelCollapsable labelText="Topics" defaultCollapse={true} triggerChildren={false}>
        <TopicSelection />
      </LabelCollapsable>
      <Label labelText="Emotions">
        <div>hello</div>
      </Label>

    </form>
  );
}
