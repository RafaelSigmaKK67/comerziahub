import Link from "next/link";
import { MessageCircle, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { LikeButton } from "./like-button";
import { formatRelative, formatCurrency } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import type { UserRole } from "@prisma/client";

export type FeedPost = {
  id: string;
  content: string | null;
  type: string;
  createdAt: Date;
  author: { id: string; name: string; image: string | null; role: UserRole };
  store: { name: string; slug: string; logoUrl: string | null } | null;
  images: { id: string; url: string }[];
  product: {
    id: string;
    name: string;
    basePrice: unknown;
    images: { url: string }[];
  } | null;
  _count: { likes: number; comments: number; shares: number };
};

export function PostCard({ post, liked }: { post: FeedPost; liked: boolean }) {
  return (
    <article className="card p-4">
      {/* Cabeçalho */}
      <header className="flex items-center gap-3">
        {post.store ? (
          <Link href={`/store/${post.store.slug}`} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-brand-600">
              <SmartImage src={post.store.logoUrl} alt={post.store.name} iconName="store" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.store.name}</p>
              <p className="text-xs text-slate-400">{formatRelative(post.createdAt)}</p>
            </div>
          </Link>
        ) : (
          <>
            <Avatar src={post.author.image} name={post.author.name} size={40} />
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                {post.author.name}
                <Badge className="bg-brand-50 text-brand-700">{ROLE_LABELS[post.author.role]}</Badge>
              </p>
              <p className="text-xs text-slate-400">{formatRelative(post.createdAt)}</p>
            </div>
          </>
        )}
        {post.type === "PROMOTION" && (
          <Badge className="ml-auto bg-accent-700 text-white">Promoção</Badge>
        )}
      </header>

      {/* Conteúdo */}
      {post.content && (
        <p className="mt-3 whitespace-pre-line text-[15px] text-slate-700">{post.content}</p>
      )}

      {/* Imagens */}
      {post.images.length > 0 && (
        <div
          className={`mt-3 grid gap-2 overflow-hidden rounded-xl ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {post.images.slice(0, 4).map((im) => (
            <SmartImage key={im.id} src={im.url} alt="" fallbackText={post.content ?? "•"} className="max-h-80 w-full object-cover" />
          ))}
        </div>
      )}

      {/* Produto anexado */}
      {post.product && (
        <Link
          href={`/product/${post.product.id}`}
          className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-300"
        >
          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <SmartImage src={post.product.images[0]?.url} alt={post.product.name} fallbackText={post.product.name} className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-800">{post.product.name}</p>
            <p className="text-sm font-bold text-brand-600">
              {formatCurrency(post.product.basePrice as number)}
            </p>
          </div>
        </Link>
      )}

      {/* Ações */}
      <footer className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-3">
        <LikeButton postId={post.id} initialLiked={liked} initialCount={post._count.likes} />
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <MessageCircle className="h-4 w-4" /> {post._count.comments}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Share2 className="h-4 w-4" /> {post._count.shares}
        </span>
      </footer>
    </article>
  );
}
