"use client"
import { Label } from "./Label";
import { DateRanges } from "./DateRanges";
import { LabelCollapsable } from "./LabelCollapsable";
import { MultiSelection } from "./MultiSelection";
import { topics } from "./TopicsSelectionData";
import { emotions } from "./EmotionsSelectionData";
import { sentiments } from "./SentimentsSelectionData";
import { SourceSelector } from "./SourceSelector/SourceSelector";
import { useForm } from "react-hook-form";
import { type QueryData, querySchema } from "./queryData";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldError } from "react-hook-form";
import { useSubreddits } from "@/app/context/subreddits-context";

export default function Sidebar() {
  const subreddits = useSubreddits();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<QueryData>({
    resolver: zodResolver(querySchema),
    mode: "onChange",
    defaultValues: {
      sources: subreddits?.filter(x => x.name !== "testingground4bots").map(x => x.name) ?? [],
      sort: "new",
      search: "",
      dateRange: undefined,
      topics: topics?.map(x => x.value) ?? [],
      irony: "",
      emotions: emotions?.map(x => x.value) ?? [],
      sentiments: sentiments?.map(x => x.value) ?? [],
      hateSpeech: "",
      offensive: "",
    },
  });

  const selectedTopics = watch("topics");

  const onSubmit = () => {

  };

  return (
    <form className="bg-neutral rounded-lg flex-col gap-4 w-xs px-4 py-6 hidden md:flex" onSubmit={handleSubmit(onSubmit)}>
      <SourceSelector register={register} watch={watch} error={errors.sources as FieldError | undefined} />
      <Label labelText="Sort by" error={errors.sort}>
        <select className="select select-sm cursor-pointer" {...register("sort")}>
          <option value="new">New</option>
          <option value="hot">Hot</option>
          <option value="top">Top</option>
          <option value="controversial">Controversial</option>
        </select>
      </Label>
      <Label labelText="Search" error={errors.search}>
        <input type="text" className="input input-sm cursor-text" placeholder="Search term" {...register("search")} />
      </Label>
      <Label labelText="Date range" error={(errors.dateRange?.from ?? errors.dateRange?.to ?? errors.dateRange) as FieldError | undefined}>
        <DateRanges control={control} />
      </Label>

      <LabelCollapsable 
        labelText={`Topics (${selectedTopics?.length ?? 0}/${topics.length})`} 
        defaultCollapse={true} triggerChildren={false}
        error={errors.topics as FieldError | undefined}
      >
        <MultiSelection list={topics} name="topics" register={register} />
      </LabelCollapsable>

      <Label labelText="Irony" error={errors.irony}>
        <select className="select select-sm cursor-pointer">
          <option value="">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>

      <Label labelText="Emotions" error={errors.emotions as FieldError | undefined}>
        <MultiSelection list={emotions} name="emotions" register={register} />
      </Label>
      <Label labelText="Sentiments" error={errors.sentiments as FieldError | undefined}>
        <MultiSelection list={sentiments} name="sentiments" register={register} />
      </Label>

      <Label labelText="Hate Speech" error={errors.hateSpeech as FieldError | undefined}>
        <select className="select select-sm cursor-pointer">
          <option value="">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>

      <Label labelText="Offensive Speech" error={errors.offensive as FieldError | undefined}>
        <select className="select select-sm cursor-pointer">
          <option value="">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>
      <button className="btn btn-lg bg-linear-to-r from-red-500 to-orange-500 text-white opacity-50 hover:opacity-100 cursor-pointer" type="submit">Query</button>
    </form>
  );
}
