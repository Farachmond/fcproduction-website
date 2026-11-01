export type ReviewStatus = "published" | "pending" | "hidden" | "rejected";

export type PublicReview = {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  body: string;
  created_at: string;
};

export type AdminReview = PublicReview & {
  status: ReviewStatus;
  spam_reasons: string[];
  updated_at: string;
};

export function stats(reviews: { rating: number }[]) {
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average: Math.round(average * 10) / 10 };
}
