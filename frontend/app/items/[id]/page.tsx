import ItemPage from "@/app/components/ItemPage/ItemPage";
import { ApiGetItem } from "@/app/lib/utils/api";
import { Metadata } from "next";
import "swiper/css";

interface Params {
  id: number;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({
  params: { id },
}: PageProps): Promise<Metadata> {
  const item = await fetchData(id);
  return {
    title: item
      ? `${item.name} - купить в магазине эксклюзивной одежды ${process.env.NEXT_PUBLIC_SHOP_NAME}`
      : "Загрузка...",
    openGraph: {
      title: item
        ? `${item.name} - купить в магазине эксклюзивной одежды ${process.env.NEXT_PUBLIC_SHOP_NAME}`
        : "Загрузка...",
      description: item ? item.description : "",
      images: item ? [item.images[0]] : [],
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/items/${id}`,
    },
  };
}

async function fetchData(id: number) {
  return await ApiGetItem(id);
}

export default async function Page({ params: { id } }: PageProps) {
  const item = await fetchData(id);

  return <ItemPage item={item} />;
}
