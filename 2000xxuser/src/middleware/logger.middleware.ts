import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //Todo : Suppose to send activity log to log MS
    console.log('SUPPOSE TO SEND LOG ACTIVITY');
    next();
  }
}
