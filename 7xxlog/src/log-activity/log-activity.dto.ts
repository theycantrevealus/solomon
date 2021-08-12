import { IsString, IsUUID, IsNumber } from 'class-validator';
import { LogActivity } from '../model/log.activity';
import { LogActivityDecorator } from './log-activity.decorator';

export class LogActivityDTO implements Readonly<LogActivityDTO> {
    @IsNumber()
    id: number;

    @IsUUID()
    user_uid: string;

    @IsString()
    table_name: string;

    @IsString()
    action: string;

    @IsString()
    logged_at: string;

    @IsString()
    old_value: string;

    @IsString()
    new_value: string;

    @IsString()
    status: string;

    @IsNumber()
    login_id: string;

    @IsString()
    unique_target: string;


    public static from(dto: Partial<LogActivityDTO>) {
        const it = new LogActivityDTO();
        it.id = dto.id;
        it.user_uid = dto.user_uid;
        it.table_name = dto.table_name;
        it.action = dto.action;
        it.logged_at = dto.logged_at;
        it.old_value = dto.old_value;
        it.new_value = dto.new_value;
        it.status = dto.status;
        it.login_id = dto.login_id;
        it.unique_target = dto.unique_target;
        return it;
    }

    public static createEntity(entity: LogActivity) {
        return this.from({
            id: entity.id,
            user_uid: entity.user_uid,
            table_name: entity.table_name,
            action: entity.action,
            logged_at: entity.logged_at,
            old_value: entity.old_value,
            new_value: entity.new_value,
            status: entity.status,
            login_id: entity.login_id,
            unique_target: entity.unique_target
        });
    }
}