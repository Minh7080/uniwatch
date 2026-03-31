import { type LucideIcon, ChevronUp, ChevronDown, Minus } from 'lucide-react';

export type Sentiment = {
  positive: boolean;
  neutral: boolean;
  negative: boolean;
};

export type SentimentKey = keyof Sentiment;

export const sentimentOptions: { label: string; value: SentimentKey, icon: LucideIcon }[] = [
  { label: 'Positive', value: 'positive', icon: ChevronUp },
  { label: 'Neutral', value: 'neutral', icon: Minus },
  { label: 'Negative', value: 'negative', icon: ChevronDown },
];
