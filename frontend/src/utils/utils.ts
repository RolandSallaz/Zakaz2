import { ChangeEvent } from 'react';
import { TOrderState } from './types';

export function ejectFile(e: ChangeEvent<HTMLInputElement>) {
  const files = e.target.files;
  const formData = new FormData();
  if (files && files.length > 0) {
    const file = files[0];
    formData.append('file', file);
  }
  return formData;
}

export const getProductText = (count: number) => {
  if (count === 1) {
    return 'товар';
  } else if (count > 1 && count < 5) {
    return 'товара';
  } else {
    return 'товаров';
  }
};

export function getProductStateText(state: TOrderState): string {
  switch (state) {
    case 'canceled':
      return 'Отменён';
    case 'confirmed':
      return 'Подтверждён';
    case 'inProgress':
      return 'В обработке';
  }
}

export function parseNumbers(value: string): string {
  return value.match(/(\d+)/g)?.join('') || '';
}
