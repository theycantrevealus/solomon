export interface IServiveTokenDecodeResponse {
  status: number;
  token: string | null;
  user: string | null;
  message: string;
  errors: { [key: string]: any };
}
