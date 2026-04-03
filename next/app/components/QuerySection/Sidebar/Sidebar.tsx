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
import { type QueryData, type QueryPayload, createQuerySchema } from "./queryData";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldError } from "react-hook-form";
import { useSubreddits } from "@/app/context/subreddits-context";
import { useQuerySchema } from "./useQuerySchema";
import { query } from "@/app/actions/query";
import { usePosts } from "@/app/context/posts-context";

export default function Sidebar() {
  const subreddits = useSubreddits();
  const schema = useQuerySchema();
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<QueryData, unknown, QueryPayload>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      sources: subreddits?.map(x => x.name) ?? [],
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

  const { cursor, posts, isLoading } = usePosts();

  const onSubmit = async (data: QueryPayload) => {
    isLoading.set(isSubmitting);
    cursor.set(null);
    const [result, err] = await query(data, null)

    if (err) {
      console.log(err);
    }

    if (result && typeof result === "object") {
      const { data, nextCursor } = result;
      console.log(data);
      posts.set(data);
      cursor.set(nextCursor)
    }

    isLoading.set(isSubmitting);
  };

  return (
    <form className="bg-neutral rounded-lg flex-col gap-4 w-xs px-4 py-6 hidden md:flex" onSubmit={handleSubmit(onSubmit)}>
      <SourceSelector register={register} watch={watch} error={errors.sources as FieldError | undefined} />
      <Label labelText="Sort by" error={errors.sort as FieldError | undefined}>
        <select className="select select-sm cursor-pointer" {...register("sort")}>
          <option value="new">New</option>
          <option value="hot">Hot</option>
          <option value="top">Top</option>
          <option value="controversial">Controversial</option>
        </select>
      </Label>
      <Label labelText="Search" error={errors.search as FieldError | undefined}>
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

      <Label labelText="Irony" error={errors.irony as FieldError | undefined}>
        <select className="select select-sm cursor-pointer" {...register("irony")}>
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
        <select className="select select-sm cursor-pointer" {...register("hateSpeech")}>
          <option value="">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>

      <Label labelText="Offensive Speech" error={errors.offensive as FieldError | undefined}>
        <select className="select select-sm cursor-pointer" {...register("offensive")}>
          <option value="">Unspecified</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </Label>
      <button className="btn btn-lg bg-linear-to-r from-red-500 to-orange-500 text-white opacity-50 hover:opacity-100 cursor-pointer" type="submit">Query</button>
    </form>
  );
}
