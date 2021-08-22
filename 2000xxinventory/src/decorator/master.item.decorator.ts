import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MasterItemDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.log_activity;
  },
);
