import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { createConnection, ConnectionOptions, getConnectionManager, getManager } from 'typeorm';
import { LogActivityService } from './log-activity.service';
import { LogActivity } from '../model/log.activity';
import { LogActivityDTO } from './log-activity.dto';
import { Crud } from '@nestjsx/crud'
import { configService } from '../config/config.service';

@Crud({
    model: {
        type: LogActivity
    }
})

@Controller('log_activity')
export class LogActivityController {
    constructor(private serv: LogActivityService) { }

    @Get()
    public async getAll() {
        return await this.serv.getAll();
    }

    @EventPattern('user_login')
    async handleActivityLog(data: Record<string, unknown>) {
        const logActivityService = new LogActivityService(getManager().getRepository(LogActivity));
        return logActivityService.create(LogActivityDTO.from(data)).then(() => {
            console.log(`[LOG] - ${data.user_uid}`);
        });
    }
}