import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { join } from "path";

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),

      PORT: Joi.number().default(8088),

      ORM_LOADING_PATH: Joi.string().required(),

      DATABASE_TYPE: Joi.string().default('mysql'),

      DATABASE_HOST: Joi.string().default('localhost'),

      DATABASE_PORT: Joi.number().default(3306),

      DATABASE_USER: Joi.string().default('root'),

      DATABASE_PWD: Joi.string(),

      DATABASE_DB: Joi.string().required(),

      DATABASE_SYNCHRONIZE: Joi.boolean().default(false),

      DATABASE_DROPSCHEMA: Joi.boolean().default(false),

      LOG_DIR: Joi.string().default(join(__dirname, '..', 'logs')),

      QUEUE_NAME: Joi.string().required(),

      REDIS_HOST: Joi.string().required().default('127.0.0.1'),

      REDIS_PORT: Joi.number().default(6379)

    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get env(): string {
    return this.envConfig.NODE_ENV;
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get ormLoadingPath(): string {
    return this.envConfig.ORM_LOADING_PATH;
  }

  get databaseType(): string {
    return this.envConfig.DATABASE_TYPE;
  }

  get queueName(): string {
    return this.envConfig.QUEUE_NAME;
  }

  get redisHost(): string {
    return this.envConfig.REDIS_HOST;
  }

  get redisPort(): string {
    return this.envConfig.REDIS_PORT;
  }

  get databaseHost(): string {
    return this.envConfig.DATABASE_HOST;
  }

  get databasePort(): number {
    return Number(this.envConfig.DATABASE_PORT);
  }

  get databaseUserName(): string {
    return this.envConfig.DATABASE_USER;
  }

  get databasePassword(): string {
    return this.envConfig.DATABASE_PWD;
  }

  get databaseName(): string {
    return this.envConfig.DATABASE_DB;
  }

  get logDir(): string {
    return this.envConfig.LOG_DIR;
  }

  get databaseSynchronize(): boolean {
    return Boolean(this.envConfig.DATABASE_SYNCHRONIZE);
  }

  get databaseDropSchema(): boolean {
    return Boolean(this.envConfig.DATABASE_DROPSCHEMA);
  }

  getTypeOrmConfig(): Record<string, any> {
    return {
      type: this.databaseType,
      host: this.databaseHost,
      port: this.databasePort,
      username: this.databaseUserName,
      password: this.databasePassword,
      database: this.databaseName,
      entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
      synchronize: this.databaseSynchronize,
      migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
      cli: {
        migrationsDir: 'src/migrations',
      },
      maxQueryExecutionTime: 1000,
      logging: "all",
      logger: "file"
    }
  }

  getQueueConfig(): Record<string, any> {
    return {
      name: this.queueName,
      redis: {
        host: this.redisHost,
        port: this.redisPort
      }
    }
  }
}
