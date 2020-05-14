import { Provider } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';
import { ConfigService } from '../config/config.service';

const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
export const redisProviders: Provider[] = [
  {
    useFactory: (): Redis => {
      return new IORedis({host: config.getRedisConfig().redis_host, port: Number(config.getRedisConfig().redis_port)});
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): Redis => {
      return new IORedis({host: config.getRedisConfig().redis_host, port: Number(config.getRedisConfig().redis_port)});
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
