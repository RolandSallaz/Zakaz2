import { ChangeEvent } from "react";
import { CategoryNode, CustomTreeNode, INextImage, TOrderState } from "./types";
import { commonClothingChildren, commonShoes, commonAccessories } from "./commonCategories";

export const categoryTree: CategoryNode[] = [
  {
    label: "Мужское",
    value: "male",
    topLevel: true,
    children: [
      {
        label: "Одежда",
        value: "clothing",
        children: [
          ...commonClothingChildren,
          { label: "Свитеры/Джемперы", value: "sweaters" },
          { label: "Кардиганы", value: "cardigans" },
          { label: "Поло", value: "polo" },
          { label: "Шорты", value: "shorts" },
          { label: "Пиджаки", value: "blazers" },
          { label: "Белье", value: "underwear" },
          { label: "Носки", value: "socks" }
        ]
      },
      {
        label: "Обувь",
        value: "shoes",
        children: commonShoes
      },
      { label: "Сумки", value: "bags" },
      {
        label: "Аксессуары",
        value: "accessories",
        children: commonAccessories
      }
    ]
  },
  {
    label: "Женское",
    value: "female",
    topLevel: true,
    children: [
      {
        label: "Одежда",
        value: "clothing",
        children: [
          ...commonClothingChildren,
          { label: "Свитеры и кардиганы", value: "sweaters_cardigans" },
          { label: "Жакеты", value: "jackets" },
          { label: "Платья", value: "dresses" },
          { label: "Юбки", value: "skirts" },
          { label: "Блузы", value: "blouses" },
          { label: "Топы", value: "tops" },
          { label: "Боди", value: "bodysuits" },
          { label: "Джинсовые куртки", value: "denim_jackets" },
          { label: "Кардиганы", value: "cardigans" },
          { label: "Майки", value: "tank_tops" },
          { label: "Кофты", value: "sweaters" }
        ]
      },
      {
        label: "Обувь",
        value: "shoes",
        children: commonShoes
      },
      { label: "Сумки", value: "bags" },
      {
        label: "Аксессуары",
        value: "accessories",
        children: commonAccessories
      }
    ]
  },
  {
    label: "Унисекс",
    value: "unisex",
    topLevel: true,
    children: [
      {
        label: "Одежда",
        value: "clothing",
        children: commonClothingChildren
      },
      {
        label: "Обувь",
        value: "shoes",
        children: commonShoes
      },
      {
        label: "Аксессуары",
        value: "accessories",
        children: commonAccessories
      }
    ]
  },
  {
    label: 'Прочее',
    value: 'otherCategory',
    topLevel: true,
  },
];

export function ejectFile(e: ChangeEvent<HTMLInputElement>) {
  const files = e.target.files;
  const formData = new FormData();
  if (files && files.length > 0) {
    const file = files[0];
    formData.append("file", file);
  }
  return formData;
}

export const getProductText = (count: number) => {
  if (count === 1) {
    return "товар";
  } else if (count > 1 && count < 5) {
    return "товара";
  } else {
    return "товаров";
  }
};

export function getProductStateText(state: TOrderState): string {
  switch (state) {
    case "canceled":
      return "Отменён";
    case "confirmed":
      return "Подтверждён";
    case "inProgress":
      return "В обработке";
  }
}

export function parseNumbers(value: string): string {
  return value.match(/(\d+)/g)?.join("") || "";
}

export function importAll(r: __WebpackModuleApi.RequireContext): {
  [key: string]: INextImage;
} {
  let images: { [key: string]: INextImage } = {};
  r.keys().forEach((item) => {
    const imageModule = r(item) as { default: INextImage };
    images[item.replace("./", "")] = imageModule.default;
  });
  return images;
}


export function addKeyToTree(nodes: CategoryNode[], parentPath: string[] = []): CustomTreeNode[] {
  return nodes.map((node) => {
    const currentPath = [...parentPath, node.value];
    return {
      key: currentPath.join('/'),
      label: node.label,
      value: node.value,
      topLevel: node.topLevel,
      level: parentPath.length,
      nodes: node.children ? addKeyToTree(node.children, currentPath) : [],
    };
  });
}

export const transformedTree = addKeyToTree(categoryTree);

export function getLabelsFromPath(path: string[], tree = categoryTree): string[] {
  const labels: string[] = [];
  let currentLevel = tree;

  for (const slug of path) {
    const found = currentLevel.find((node) => node.value === slug);
    if (!found) break;
    labels.push(found.label);
    currentLevel = found.children || [];
  }

  return labels;
}