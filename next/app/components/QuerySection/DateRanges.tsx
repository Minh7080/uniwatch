"use client"
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import Label from "./Label";
import { type QueryData, type QueryPayload } from "./queryData";

type DateRangesProps = {
  control: Control<QueryData, unknown, QueryPayload>;
  id?: string;
};

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getPresetDates(preset: string): { from: string; to: string } | undefined {
  const today = new Date();
  switch (preset) {
    case "today":
      return { from: formatDate(today), to: formatDate(today) };
    case "week": {
      const from = new Date(today);
      from.setDate(today.getDate() - 7);
      return { from: formatDate(from), to: formatDate(today) };
    }
    case "month": {
      const from = new Date(today);
      from.setMonth(today.getMonth() - 1);
      return { from: formatDate(from), to: formatDate(today) };
    }
    case "year": {
      const from = new Date(today);
      from.setFullYear(today.getFullYear() - 1);
      return { from: formatDate(from), to: formatDate(today) };
    }
    default:
      return undefined;
  }
}

export default function DateRanges({ control, id }: DateRangesProps) {
  const [selectValue, setSelectValue] = useState("all");

  return (
    <Controller
      control={control}
      name="dateRange"
      render={({ field }) => {
        const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value;
          setSelectValue(val);
          if (val === "custom") {
            field.onChange({ from: "", to: "" });
          } else {
            field.onChange(getPresetDates(val));
          }
        };

        return (
          <div id={id} className="flex flex-col w-full">
            <select
              className="select select-sm cursor-pointer"
              value={selectValue}
              onChange={handlePresetChange}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
              <option value="custom">Custom</option>
            </select>

            {selectValue === "custom" && (
              <div className="flex w-full gap-2 mt-2">
                <Label labelText="From" error={undefined}>
                  <input
                    type="date"
                    className="input input-sm w-full cursor-pointer"
                    value={field.value?.from ?? ""}
                    onChange={e => field.onChange({ ...field.value, from: e.target.value })}
                  />
                </Label>
                <Label labelText="To" error={undefined}>
                  <input
                    type="date"
                    className="input input-sm w-full cursor-pointer"
                    value={field.value?.to ?? ""}
                    onChange={e => field.onChange({ ...field.value, to: e.target.value })}
                  />
                </Label>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export { DateRanges };
