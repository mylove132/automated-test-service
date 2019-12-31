import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';

@Processor('automated')
export class QueueConsumer {

    @Process('addCaseList')
    async transcode(job: Job<unknown>) {
        let progress = 0;
        console.log(job.data)
        return job;
    }
}



