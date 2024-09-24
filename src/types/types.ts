export type HttpError = Error & {
  status?: number;
  msg?: string;
  errorData?: unknown;
};
