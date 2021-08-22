import { IUser } from './user.interface';

export interface IServiceUserEditResponse {
  status: number;
  message: string;
  user: IUser | null;
  errors: { [key: string]: any };
}
