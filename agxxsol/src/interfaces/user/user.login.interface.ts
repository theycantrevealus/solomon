import { IUser } from './user.interface';

export interface IServiceUserLoginResponse {
  status: number;
  message: string;
  user: IUser | null;
  errors: { [key: string]: any };
}
