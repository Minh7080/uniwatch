"use client"
import { Label } from "./Label";
import { DateRanges } from "./DateRanges";
import { LabelCollapsable } from "./LabelCollapsable";
import { MultiSelection } from "./MultiSelection";
import { topics } from "./TopicsSelectionData";
import { emotions } from "./EmotionsSelectionData";
import { sentiments } from "./SentimentsSelectionData";

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
        <MultiSelection list={topics} name="topics"/>
      </LabelCollapsable>

      <Label labelText="Irony">
        <select className="select select-sm" defaultValue="Unspecified">
          <option value="unspecified">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>

      <Label labelText="Emotions">
        <MultiSelection list={emotions} name="emotions"/>
      </Label>
      <Label labelText="Sentiments">
        <MultiSelection list={sentiments} name="sentiments"/>
      </Label>

      <Label labelText="Hate Speech">
        <select className="select select-sm" defaultValue="unspecified">
          <option value="unspecified">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>

      <Label labelText="Offensive Speech">
        <select className="select select-sm" defaultValue="unspecified">
          <option value="unspecified">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>
      <button className="btn btn-lg bg-linear-to-r from-red-500 to-orange-500 text-white opacity-50 hover:opacity-100" type="button">Query</button>
    </form>
  );
}
