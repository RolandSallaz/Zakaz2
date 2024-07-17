import { ChangeEvent } from 'react';

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
