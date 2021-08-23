export interface IServiceUserEditResponse {
  status: number;
  message: string;
  user: any | null;
  errors: { [key: string]: any };
}
