export type queryType = {
  sources?: string[],
  dateRanges?: {
    from: string,
    to: string,
  },
  topic?: string[],
  searchTerm?: string,
  emotion?: string[],
  sentiment?: string[],
  irony?: boolean,
  upvotes?: {
    min: number,
    max: number,
  },
  comments?: {
    min: number,
    max: number,
  },
  upvoteRatio?: number,
  hateSpeech?: boolean,
  offensive?: boolean,
  sort: string
};
