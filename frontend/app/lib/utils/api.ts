import { mainFilter } from "@/app/page";
import { apiUrl } from "./config";
import {
  IAuthData,
  IFIle,
  IFetch,
  IInfoType,
  IItem,
  IItemDto,
  IItemPagination,
  IOrder,
  IOrderDto,
  IRequest,
  ITypeSelect,
  IUser,
  TInfoType,
} from "./types";

function checkResponse<T>(res: Response): Promise<T> {
  return res.ok ? res.json() : res.json().then((data) => Promise.reject(data));
}

function _fetch<T>({ url, method = "GET", headers, body }: IFetch): Promise<T> {
  let contentTypeHeader: string | undefined = undefined;
  let authorization = "";
  // Получаем токен авторизации перед каждым запросом
  if (typeof window !== "undefined") {
    authorization = localStorage.getItem("jwt") || "";
  }

  // Устанавливаем заголовок Content-Type в зависимости от типа тела запроса
  if (body instanceof FormData) {
    // Если тело запроса - FormData, не устанавливаем Content-Type (будет установлен автоматически)
  } else if (body) {
    // Если тело запроса - не пустое и не FormData, устанавливаем Content-Type: application/json
    contentTypeHeader = "application/json";
  }

  // Объединяем заголовки с дополнительными заголовками и устанавливаем Content-Type при необходимости
  const mergedHeaders = {
    authorization,
    ...(contentTypeHeader ? { "Content-Type": contentTypeHeader } : {}),
    ...headers,
  };

  const requestBody: BodyInit =
    body instanceof FormData ? body : JSON.stringify(body);

  return fetch(`${apiUrl}/${url}`, {
    method,
    headers: mergedHeaders,
    body: requestBody,
  }).then(checkResponse<T>);
}

export function checkUser(email: string): Promise<IRequest> {
  return _fetch<IRequest>({ url: `users/${email}` });
}

export function sendAuthCode(email: string) {
  return _fetch<IRequest>({
    url: `auth/code`,
    method: "POST",
    body: { email },
  });
}

export function ApiLogin({
  email,
  code,
}: {
  email: string;
  code: number;
}): Promise<IUser> {
  return _fetch<IAuthData>({
    url: `auth`,
    method: "POST",
    body: {
      email,
      code,
    },
  }).then(({ token, ...user }) => {
    localStorage.setItem("jwt", `Bearer ${token}`);
    return user;
  });
}

export function ApiCheckAuth(): Promise<IUser> {
  return _fetch<IUser>({ url: "auth" });
}

export function ApiGetAllUsers(): Promise<IUser[]> {
  return _fetch<IUser[]>({ url: "users" });
}

export function ApiUpdateUser(id: number, newData: IUser): Promise<IUser> {
  return _fetch<IUser>({
    url: `users/${id}`,
    method: "PATCH",
    body: { ...newData },
  });
}

export function ApiPostImages(file: FormData): Promise<IFIle[]> {
  return _fetch<IFIle[]>({ url: "files", method: "POST", body: file });
}

export function ApiPostItem(item: IItemDto): Promise<IItem> {
  return _fetch<IItem>({ url: "items", method: "POST", body: { ...item } });
}

export function ApiUpdateItem(id: number, item: IItemDto): Promise<IItem> {
  return _fetch<IItem>({
    url: `items/${id}`,
    method: "PATCH",
    body: { ...item },
  });
}

export function ApiGetItems(): Promise<IItem[]> {
  return _fetch<IItem[]>({ url: "items" });
}

export function ApiGetItemsWithPage({
  itemsInPage = 20,
  page = 1,
  filter = 'all',
}: {
  itemsInPage?: number;
  page?: number;
  filter?: mainFilter;
} = {}): Promise<IItemPagination> {
  return _fetch<IItemPagination>({ url: `items/with-pagination?itemsInPage=${itemsInPage}&page=${page}&filter=${filter}` })
}

export function ApiGetItem(id: number): Promise<IItem> {
  return _fetch<IItem>({ url: `items/${id}` });
}

export function ApiGetItemsByName(name: string): Promise<IItem[]> {
  return _fetch<IItem[]>({ url: `items/by-name/${name}` })
}

export function ApiGetItemsBySearch({ find, gender, type, page, itemsInPage = 20 }: { find: string, gender: string | null, type: string, page: number, itemsInPage?: number; }): Promise<IItemPagination> {
  return _fetch<IItemPagination>({ url: `items/search?find=${find}&gender=${gender}&type=${type}&page=${page}&itemsInPage=${itemsInPage}` })

}

export function ApiDeleteItem(id: number): Promise<IItem> {
  return _fetch<IItem>({ url: `items/${id}`, method: "DELETE" });
}

export function ApiGetTypeSelectors(): Promise<ITypeSelect[]> {
  return _fetch<ITypeSelect[]>({ url: "item-selectors" });
}

export function ApiGetActualItemsInfo(data: string): Promise<IItem[]> {
  return _fetch<IItem[]>({ url: `items/actual/${data}` });
}

export function ApiGetAllOrders(): Promise<IOrder[]> {
  return _fetch<IOrder[]>({ url: "orders" });
}

export function ApiSendOrder(data: IOrderDto): Promise<IOrder> {
  return _fetch<IOrder>({ url: "orders", method: "POST", body: { ...data } });
}

export function ApiUpdateOrder(id: number, dto: IOrder): Promise<IOrder> {
  return _fetch<IOrder>({
    url: `orders/${id}`,
    method: "PATCH",
    body: { ...dto },
  });
}

export function ApiGetMyOrders(): Promise<IOrder[]> {
  return _fetch<IOrder[]>({ url: "orders/my-orders" });
}

export function ApiGetInfo(infoType: TInfoType): Promise<IInfoType> {
  return _fetch<IInfoType>({ url: `info/${infoType}` });
}

export function ApiUpdateInfo(
  infoType: TInfoType,
  value: string
): Promise<IInfoType> {
  return _fetch<IInfoType>({
    url: `info/${infoType}`,
    method: "PATCH",
    body: { value },
  });
}
