import type { Product } from "@/lib/types";

export function computeProductScore(p: Product) {
  let score = 0;

  const apr = Number(p.rate_apr);
  if (apr < 10) score += 4;
  else if (apr < 12) score += 3;
  else if (apr < 14) score += 2;
  else score += 1;

  const income = Number(p.min_income);
  if (income <= 20000) score += 3;
  else if (income <= 30000) score += 2;
  else if (income <= 40000) score += 1;

  if (p.min_credit_score <= 650) score += 3;
  else if (p.min_credit_score <= 700) score += 2;
  else score += 1;

  if (p.disbursal_speed === "instant") score += 3;
  else if (p.disbursal_speed === "fast") score += 2;
  else score += 1;

  if (p.prepayment_allowed) score += 2;

  const spread = p.tenure_max_months - p.tenure_min_months;
  if (spread >= 120) score += 2;
  else if (spread >= 60) score += 1;

  return score;
}
