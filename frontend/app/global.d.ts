declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare const require: {
  context: (
    path: string,
    deep?: boolean,
    filter?: RegExp
  ) => __WebpackModuleApi.RequireContext;
};

declare namespace __WebpackModuleApi {
  interface RequireContext {
    keys(): string[];
    <T>(id: string): T;
  }
}
