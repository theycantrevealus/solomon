import { IsString, IsUUID, IsNumber } from 'class-validator';

export class UserPagingDTO implements Readonly<UserPagingDTO> {
  @IsString()
  search: string;

  @IsNumber()
  start: number;

  @IsNumber()
  length: number;

  @IsNumber()
  draw: number;

  public static from(dto: Partial<UserPagingDTO>) {
    const it = new UserPagingDTO();
    it.search = dto.search;
    it.start = dto.start;
    it.length = dto.length;
    it.draw = dto.draw;
    return it;
  }

  public static createModel(entity: any) {
    return this.from({
      search: entity.search,
      start: entity.start,
      length: entity.length,
      draw: entity.draw,
    });
  }
}
