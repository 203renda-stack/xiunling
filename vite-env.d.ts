// Manually declare globals provided by Vite's define plugin for process.env
// The reference to vite/client was causing an error as the types could not be found.

declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
