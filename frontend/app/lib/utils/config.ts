export const apiUrl =
  process.env.NODE_ENV == "development"
    ? "http://192.168.1.2:3000"
    : `${process.env.NEXT_PUBLIC_DOMAIN}/api`;
