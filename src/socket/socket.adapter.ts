import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '../config/config.service';
import * as redisIoAdapter from 'socket.io-redis';
import { Server, ServerOptions } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { Redis } from 'ioredis';


const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

const redis = redisIoAdapter({
  host: config.getRedisConfig().redis_host,
  port: Number(config.getRedisConfig().redis_port),
  auth_pass: config.getRedisConfig().redis_password,
  pubClient: this.pubClient,
  subClient: this.subClient,
})
export class RedisIoAdapter extends IoAdapter {

  constructor(app: INestApplication, private readonly subClient: Redis, private readonly pubClient: Redis) {
    super(app);
  }
  public createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    server.adapter(redis);
    return server;
  }
}