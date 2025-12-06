"use client";

import { Badge } from "@/components/ui/badge";

interface BadgeListProps {
  badges: string[];
}

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map((badge) => (
        <Badge key={badge} variant="secondary" className="text-xs">
          {badge}
        </Badge>
      ))}
    </div>
  );
}
