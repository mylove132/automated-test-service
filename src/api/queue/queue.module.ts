import {DynamicModule, Module} from '@nestjs/common';
import { RunProcessor } from "./run.processor";
import { BullModule } from "@nestjs/bull";
import {ConfigService} from "../../config/config.service";


const RedisConfig = (): DynamicModule => {
  console.log('连接redis中....');
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  return BullModule.registerQueue(config.getQueueConfig());
};

@Module({
  imports: [RedisConfig()],
  providers: [RunProcessor],
  exports: [RedisConfig()]
})
export class QueueModule {}
