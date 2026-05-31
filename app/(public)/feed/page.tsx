import Link from "next/link";
import { Newspaper } from "lucide-react";
import { PostCard, type FeedPost } from "@/components/social/post-card";
import { PostComposer } from "@/components/social/post-composer";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getFeedPosts, getPostLikedSet } from "@/services/social";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Feed" };

export default async function FeedPage() {
  const user = await getCurrentUser();
  const posts = await getFeedPosts(40);
  const likedSet = user
    ? await getPostLikedSet(user.id, posts.map((p) => p.id))
    : new Set<string>();

  return (
    <div className="container-page max-w-2xl py-8">
      <h1 className="text-2xl font-bold text-slate-900">Feed social</h1>
      <p className="mt-1 text-sm text-slate-500">
        Novidades de lojas e pessoas que você acompanha.
      </p>

      <div className="mt-6 space-y-4">
        {user ? (
          <PostComposer userName={user.name} userImage={user.image} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
            <Link href="/login?callbackUrl=/feed" className="font-medium text-brand-600 hover:underline">
              Entre
            </Link>{" "}
            para publicar, curtir e comentar.
          </div>
        )}

        {posts.length > 0 ? (
          posts.map((p) => (
            <PostCard key={p.id} post={p as unknown as FeedPost} liked={likedSet.has(p.id)} />
          ))
        ) : (
          <EmptyState
            icon={Newspaper}
            title="O feed está vazio"
            description="Quando lojas e usuários publicarem, aparecerá aqui."
            action={
              <Link href="/marketplace" className={buttonVariants({ variant: "primary" })}>
                Explorar lojas
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
