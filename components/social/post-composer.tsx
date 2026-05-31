"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPost } from "@/actions/social";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function PostComposer({
  userName,
  userImage,
}: {
  userName?: string | null;
  userImage?: string | null;
}) {
  const [state, action, pending] = useActionState(createPost, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state.success]);

  return (
    <form ref={ref} action={action} className="card p-4">
      <div className="flex gap-3">
        <Avatar src={userImage} name={userName} size={40} />
        <div className="flex-1">
          <textarea
            name="content"
            required
            placeholder="Compartilhe novidades, promoções ou produtos..."
            className="input-base min-h-[72px] resize-none border-0 bg-slate-50 focus:ring-1"
          />
          {state.error && <p className="mt-1 text-xs text-rose-600">{state.error}</p>}
          <div className="mt-2 flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
