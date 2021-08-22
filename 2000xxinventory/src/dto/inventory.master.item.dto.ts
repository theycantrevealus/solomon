import { IsString, IsUUID, IsNumber } from 'class-validator';
import { MasterItem } from '../model/inventory.master.item';

export class MasterItemDTO implements Readonly<MasterItemDTO> {
  @IsUUID()
  uid: string;

  @IsString()
  kode: string;

  @IsString()
  nama: string;

  @IsUUID()
  units: string;

  @IsUUID()
  manufacture: string;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;

  @IsString()
  deleted_at: string;

  public static from(dto: Partial<MasterItemDTO>) {
    const it = new MasterItemDTO();
    it.uid = dto.uid;
    it.kode = dto.kode;
    it.nama = dto.nama;
    it.units = dto.units;
    it.manufacture = dto.manufacture;
    it.created_at = dto.created_at;
    it.updated_at = dto.updated_at;
    it.deleted_at = dto.deleted_at;
    return it;
  }

  public static createEntity(entity: MasterItem) {
    return this.from({
      uid: entity.uid,
      kode: entity.kode,
      nama: entity.nama,
      units: entity.units,
      manufacture: entity.manufacture,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}
