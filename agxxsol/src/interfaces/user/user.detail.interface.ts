import { IUser } from './user.interface';

export interface IServiceUserDetailResponse {
  status: number;
  message: string;
  user: IUser | null;
}
