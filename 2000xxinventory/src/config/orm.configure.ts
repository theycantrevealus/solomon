import { configService } from './orm.config';
import fs = require('fs');
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
