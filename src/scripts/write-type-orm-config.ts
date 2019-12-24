import { ConfigService } from '../config/config.service';
import * as fs from 'fs';

const config = new ConfigService(`env/${process.env.NODE_ENV || 'development'}.env`);
fs.writeFileSync('ormconfig.json',
 JSON.stringify(config.getTypeOrmConfig(), null, 2)
);