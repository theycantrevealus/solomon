export interface ITokenDecodeResponse {
  status: number;
  token: string | null;
  user: string;
  message: string;
}
