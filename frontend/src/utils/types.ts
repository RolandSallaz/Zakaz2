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
  role: string;
}

export interface IAuthData extends IUser {
  token: string;
}

export interface ISnackBar {
  isOpen?: boolean;
  text: string;
  hasError?: boolean;
}
