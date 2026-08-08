import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { HeartIcon, MessageIcon, BookmarkIcon, MoreIcon } from "@/components/ui/icons";

interface FeedPostProps {
  avatar: ReactNode;
  name: string;
  meta: string;
  children: ReactNode;
  showFooter?: boolean;
  likeCount?: number;
  commentCount?: number;
}

export function FeedPost({ avatar, name, meta, children, showFooter = false, likeCount, commentCount }: FeedPostProps) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2.5">
        {avatar}
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-extrabold text-text-primary">{name}</div>
          <div className="truncate text-[11.5px] font-semibold text-text-muted">{meta}</div>
        </div>
        <MoreIcon width={18} height={18} className="flex-none text-text-muted" />
      </div>
      {children}
      {showFooter ? (
        <div className="mt-3 flex items-center gap-4 border-t border-border-subtle pt-3 text-[12.5px] font-bold text-text-secondary">
          <span className="flex items-center gap-1.5">
            <HeartIcon width={15} height={15} /> {likeCount ?? 0} grabbed this
          </span>
          <span className="flex items-center gap-1.5">
            <MessageIcon width={15} height={15} /> {commentCount ?? 0}
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <BookmarkIcon width={15} height={15} /> Save
          </span>
        </div>
      ) : null}
    </Card>
  );
}
