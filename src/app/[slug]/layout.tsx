import type { Metadata } from "next";
import { getCreatorBySlug } from "@/db/queries/creators";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);

  if (!creator) {
    return { title: "クリエイターが見つかりません" };
  }

  const title = `${creator.displayName} | FANPASS`;
  const description = creator.bio
    ? creator.bio.substring(0, 120)
    : `${creator.displayName}のファンクラブ - FANPASS`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "FANPASS",
      type: "profile",
      url: `https://fanpass-app.vercel.app/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
