import { Module, HttpModule, Global } from '@nestjs/common';
import { CurlService } from './curl.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [CurlService],
  exports: [HttpModule, CurlModule, CurlService],
})
export class CurlModule {}