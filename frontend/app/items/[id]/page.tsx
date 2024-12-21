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
      ? `Купить ${item.name}`
      : "Загрузка...",
    openGraph: {
      title: item
        ? `Купить ${item.name}`
        : "Загрузка...",
      description: item ? `Купить ${item.name} в продаже магазине эсклюзивной одежды ${process.env.NEXT_PUBLIC_SHOP_NAME}` : "",
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
