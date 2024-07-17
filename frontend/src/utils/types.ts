export enum ROLES {
  USER = 0,
  MANAGER = 1,
  ADMIN = 2,
}

export interface IRequest {
  message: string;
}

export interface IRequestError extends IRequest {
  statusCode: number;
}

export interface IFetch {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown>;
}

export interface IUser {
  email: string;
  id: number;
  auth_level: ROLES;
  register_date: string;
}

export interface IAuthData extends IUser {
  token: string;
}

export interface ISnackBar {
  isOpen?: boolean;
  text: string;
  hasError?: boolean;
}

export interface IConfirmPopup {
  isOpen: boolean;
  cb: () => void;
}

export interface IFIle {
  originalName: string;
  fileName: string;
  filePath: string;
}

export type TGender = 'male' | 'female' | 'unisex';
export type TActiveTime = '90d' | '180d' | 'Infinity';
export type TCardType = 'default' | 'cart' | 'big';

export interface IItemDto
  extends Omit<IItem, 'id' | 'start_sell_date' | 'end_sell_date'> {
  active_time: TActiveTime;
}

export interface IItem {
  id: number;
  name: string;
  description: string;
  price: number;
  start_sell_date: Date;
  end_sell_date: Date | null;
  is_active: boolean;
  gender: TGender;
  type: string;
  images: string[];
  creator_email?: string;
  selected?: boolean;
}

export interface ISelect {
  label: string;
  value: string;
}

export interface ITypeSelect {
  id: number;
  name: string;
}

export interface IOrder {
  id: number;
  telegram: string;
  phone: string;
  items: IItem[];
  customer_email: string;
  create_date: Date;
}

export interface IOrderDto extends Pick<IOrder, 'telegram' | 'phone'> {
  itemsIds: number[];
}

export interface IInfoPopup {
  text: string;
  isOpened: boolean;
}
