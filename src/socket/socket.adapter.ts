import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '../config/config.service';
const redis = require('socket.io-redis');

const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
const redisAdapter = redis({ host: config.getRedisConfig().redis_host, port: config.getRedisConfig().redis_host });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}