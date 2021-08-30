import { InterfaceUser } from './user.interface';

export interface userRMQLoginRequest {
  status: number;
  message: string;
  user: InterfaceUser | null;
  errors: { [key: string]: any };
}
