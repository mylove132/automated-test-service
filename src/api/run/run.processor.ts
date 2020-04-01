import {Process, Processor} from '@nestjs/bull';
import {HttpStatus, Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Repository} from "typeorm";
import {CaseEntity} from "../case/case.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import { CurlService } from "../curl/curl.service";

@Processor('dingdingProcessor')
export class RunProcessor {

  constructor(
    private readonly curlService: CurlService,
  ){}

    @Process('sendMessage')
    async handleTranscode(job: Job) {
         this.curlService.sendDingTalkMessage(job.data.message);
    }
}
