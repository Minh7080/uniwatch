"use client"
import { useState } from "react";
import Label from "./Label";

export default function DateRanges() {
  const [selectValue, setSelectValue] = useState("today");
  return (
    <div className="flex flex-col w-full">
      <select className="select select-sm" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="time">All Time</option>
        <option value="custom">Custom</option>
      </select>

      {
        selectValue === "custom" && (
          <div className="flex w-full gap-2">
            <Label labelText="From">
              <input type="date" className="input input-sm w-full" />
            </Label>

            <Label labelText="To">
              <input type="date" className="input input-sm w-full" />
            </Label>
          </div>
        )
      }
    </div>
  );
};

export { DateRanges };
