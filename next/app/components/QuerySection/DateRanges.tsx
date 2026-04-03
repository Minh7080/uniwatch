"use client"
import { useState } from "react";
import Label from "./Label";

export default function DateRanges() {
  const [selectValue, setSelectValue] = useState("all");
  return (
    <div className="flex flex-col w-full">
      <select className="select select-sm cursor-pointer" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="all">All Time</option>
        <option value="custom">Custom</option>
      </select>

      {
        selectValue === "custom" && (
          <div className="flex w-full gap-2">
            <Label labelText="From" error={undefined}>
              <input type="date" className="input input-sm w-full cursor-pointer" />
            </Label>

            <Label labelText="To" error={undefined}>
              <input type="date" className="input input-sm w-full cursor-pointer" />
            </Label>
          </div>
        )
      }
    </div>
  );
};

export { DateRanges };
