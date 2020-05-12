import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OperateEntity } from "./operate.entity";
import { ExceptionEntity } from "./expection.entity";
import {
  findOperateByUserAndOperate,
  saveException,
  saveOperate
} from "../../datasource/operate/operate.sql";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import {OperateModule, OperateType} from "../../config/base.enum";


@Injectable()
export class OperateService {
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
    @InjectRepository(ExceptionEntity)
    private readonly exceptionRepository: Repository<ExceptionEntity>
  ) {
  }

  /**
   * 分页信息
   * @param options
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<OperateEntity>> {
    return await paginate<OperateEntity>(this.operateRepository, options);
  }


  /**
   * 创建操作记录
   * @param operateEntity
   */
  async createOperateService (operateEntity: OperateEntity) {
    return await saveOperate(this.operateRepository, operateEntity);
  }


  /**
   * 创建异常记录
   * @param exceptionEntity
   */
  async createExceptionService (exceptionEntity: ExceptionEntity) {
    return await saveException(this.exceptionRepository, exceptionEntity);
  }

  /**
   * 查询操作记录
   * @param userId
   * @param operateModule
   * @param operateType
   * @param keyword
   * @param options
   */
  async findOperateService (userId: number, operateModule: OperateModule, operateType: OperateType, keyword: string,  options: IPaginationOptions): Promise<Pagination<OperateEntity>> {

    const queryBuilder = await findOperateByUserAndOperate(this.operateRepository, userId, operateModule, operateType, keyword);
    return await paginate<OperateEntity>(queryBuilder, options);
  }

  // /**
  //  * 通过关键字查询操作记录
  //  * @param keyword
  //  * @param options
  //  */
  // async findOperateByKeyword(keyword: string, options: IPaginationOptions): Promise<Pagination<OperateEntity>> {
  //   const queryBuilder = await findOperateByKeywords(this.operateRepository, keyword);
  //   return await paginate<OperateEntity>(queryBuilder, options);
  // }
}
