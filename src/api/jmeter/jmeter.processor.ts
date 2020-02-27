import {Process, Processor} from '@nestjs/bull';
import {HttpStatus, Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Repository} from "typeorm";
import {CaseEntity} from "../case/case.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";

@Processor('jmeter')
export class JmeterProcessor {

    private readonly logger = new Logger(JmeterProcessor.name);

    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
    ) {
    }

    @Process('exec_jmeter')
    async handleTranscode(job: Job) {
        const caseIds = job.data.caseIds;
        if (caseIds == null || caseIds.length == 0) {
            throw new ApiException("执行压测的接口数不能为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const caseList: CaseEntity[] = await this.caseRepository.findByIds(caseIds);
        for (const caseObj of caseList){
            this.logger.debug(caseObj);
        }
    }
}
