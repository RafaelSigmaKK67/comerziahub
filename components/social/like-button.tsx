"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { togglePostLike } from "@/actions/social";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    start(async () => {
      const res = await togglePostLike(postId);
      if (res?.error === "AUTH_REQUIRED") {
        setLiked(initialLiked);
        setCount(initialCount);
        router.push("/login?callbackUrl=/feed");
      } else if (typeof res?.liked === "boolean") {
        setLiked(res.liked);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium transition",
        liked ? "text-rose-600" : "text-slate-500 hover:text-rose-600",
      )}
    >
      <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
      {count}
    </button>
  );
}
