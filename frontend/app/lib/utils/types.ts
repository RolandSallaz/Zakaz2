export enum ROLES {
  USER = 0,
  MANAGER = 1,
  ADMIN = 2,
}

export interface CustomTreeNode {
  key: string;
  label: string;
  value: string;
  topLevel?: boolean;
  level: number;
  nodes: CustomTreeNode[];
}

export type CategoryNode = {
  label: string;
  value: string;
  children?: CategoryNode[];
  topLevel?: boolean;
};


export interface ISystemInfo {
  cpu: string;
  disk: {
    space: {
      usedInGB: string;
      sizeInGB: string;
    }[];
  };
  ram: {
    totalMemory: string;
    freeMemory: string;
    usedMemory: string;
    nodeMemory: string;
  };
}

export interface IRequest {
  message: string;
}

export interface IRequestError extends IRequest {
  statusCode: number;
}

export interface IFetch {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown>;
}

export interface IUser {
  email: string;
  id: number;
  auth_level: ROLES;
  register_date: string;
  createdItems: IItem[];
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

export type TGender = "male" | "female" | "unisex";
export type TActiveTime = "90d" | "180d" | "Infinity";
export type TCardType = "default" | "cart" | "big";
export type TOrderState = "confirmed" | "canceled" | "inProgress";

export interface IItemDto
  extends Omit<IItem, "id" | "start_sell_date" | "end_sell_date"> {
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
  inStock: boolean;
  type: string;
  images: string[];
  creator_email?: string;
  selected?: boolean;
  category: string[];
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
  // state: TOrderState;
  is_error: boolean;
}

export interface IOrderDto extends Pick<IOrder, "telegram" | "phone"> {
  itemsIds: number[];
}

export interface IInfoPopup {
  text: string;
  isOpened: boolean;
}

export type TInfoType =
  | "heading_info"
  | "order"
  | "customer-help"
  | "delivery-and-refund"
  | "contacts"
  | "privacy-policy";

export interface IInfoType {
  key: TInfoType;
  value: string;
}

export interface INextImage {
  src: string;
}

export interface IItemPagination {
  items: IItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}