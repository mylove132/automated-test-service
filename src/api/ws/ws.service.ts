import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import {Server} from 'socket.io';
import {RunService} from '../run/run.service';
import {IRunCaseById} from '../run/run.interface';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {HistoryEntity} from '../history/history.entity';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {Executor, RequestStatusEnum} from '../history/dto/history.enum';

@WebSocketGateway(3003)
export class WsService{

    constructor(@InjectRepository(CaselistEntity)
                private readonly caseListRepository: Repository<CaselistEntity>,
                @InjectRepository(HistoryEntity)
                private readonly historyRepository: Repository<HistoryEntity>,
                private readonly runService: RunService){}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    async runCaseList(@MessageBody() data: any){
        const envIds: number[] = data.envIds;
        const caselistId: number = data.caselistId;
        const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id = :id',{id: caselistId}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!caseListObj){
            throw new WsException(`用例ID:${caselistId}未找到`);
        }
        const caseList = await this.caseListRepository.createQueryBuilder('caselist').select().
        where('caselist.id = :id',{id: caselistId}).
        leftJoinAndSelect('caselist.cases','case').getOne();
        const cases = caseList.cases;
        const re = [];
       for (const cas of cases){
           for (const envId of envIds){
               const runCaseDto = new RunCaseDto(cas.id, envId);
               const result = await this.runService.runCaseById(runCaseDto);
               const res = {caseId: cas.id, envId: envId, result: result};
               // const history = new HistoryEntity();
               // history.case = cas;
               // history.result = JSON.stringify(res);
               // history.executor = Executor.MANUAL;
               // if (result.toString().indexOf(cas.assertText) != -1){
               //     history.status = RequestStatusEnum.SUCCESS
               // }else {
               //     history.status = RequestStatusEnum.FAIL
               // }
               // await this.historyRepository.createQueryBuilder().insert().into(HistoryEntity).values(history).execute().catch(
               //     err => {
               //         console.log(err);
               //         throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
               //     }
               // )
               re.push(res);
           }
       }
       console.log(re);
       return from(re).pipe(map( item => ({ event: 'events', data: item })))
        }
    async runCaseByEnvId(caselistId: number, envId: number){
        const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id = :id',{id: caselistId}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!caseListObj){
            throw new WsException(`用例ID:${caselistId}未找到`);
        }
        const caseList = await this.caseListRepository.createQueryBuilder('caselist').select().
        where('caselist.id = :id',{id: caselistId}).
        leftJoinAndSelect('caselist.cases','case').getOne();
        const cases = caseList.cases;
        return from(cases).pipe(map(async item => {
            const runCaseDto = new RunCaseDto(item.id, envId);
            const result = await this.runService.runCaseById(runCaseDto);
            console.log(result);
            const rs = {caseId: item.id,envId: envId,result: result};
            return rs;
        })).toPromise();
    }
}




export class RunCaseDto implements IRunCaseById{

    readonly caseId: number;
    readonly envId: number;

    constructor(readonly cId: number, readonly eId: number){
        this.caseId = cId;
        this.envId = eId;
    }
}
