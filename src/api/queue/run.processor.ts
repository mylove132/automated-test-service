import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';
import { CurlService } from "../curl/curl.service";

@Processor('dingdingProcessor')
export class RunProcessor {

  constructor(
    private readonly curlService: CurlService,
  ){}

    @Process('sendMessage')
    handleTranscode(job: Job) {
        this.curlService.sendDingTalkMessage(job.data);
    }
}
