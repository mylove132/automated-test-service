import {ArgumentMetadata, HttpStatus, Injectable, Logger, PipeTransform,} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToClass} from 'class-transformer';
import * as _ from 'lodash';
import {ApiException} from '../exceptions/api.exception';
import {ApiErrorCode} from '../enums/api.error.code';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    Logger.log(errors);
    if (errors.length > 0) {
      // 遍历全部的错误信息,返回给前端
      const errorMessage = errors.map(item => {
        return {
          currentValue: item.value,
          [item.property]: _.values(item.constraints)[0],
        };
      });
      throw new ApiException(JSON.stringify(errorMessage),ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

