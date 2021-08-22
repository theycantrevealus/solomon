import { IsString, IsUUID } from 'class-validator';
import { UserModel } from '../../model/user.model';

export class UserEditDTO {
  @IsUUID()
  uid: string;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  password: string;

  @IsString()
  updated_at: string;

  @IsString()
  deleted_at: string;

  public static from(dto: Partial<UserEditDTO>) {
    const it = new UserEditDTO();
    it.uid = dto.uid;
    it.email = dto.email;
    it.first_name = dto.first_name;
    it.last_name = dto.last_name;
    it.password = dto.password;
    it.updated_at = dto.updated_at;
    it.deleted_at = dto.deleted_at;
    return it;
  }

  public static createModel(entity: any) {
    return this.from({
      uid: entity.uid,
      email: entity.email,
      first_name: entity.first_name,
      last_name: entity.last_name,
      password: entity.password,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}
