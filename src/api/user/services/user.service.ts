import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { ApiException } from '../../../common/exceptions/api.exception';
import { ApiErrorCode } from '../../../common/enums/api.error.code';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService{

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async findUserById(userId: number): Promise<User>{
    if (userId == 0 || userId == null){
      throw new ApiException('查询用户id不能为空', ApiErrorCode.USER_ID_INVALID, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne(userId);
    if (user == null){
      throw new ApiException('查询用户id不存在', ApiErrorCode.USER_ID_INVALID, HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
