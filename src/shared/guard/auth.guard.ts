import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../../config';
import { UserService } from '../../api/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private readonly reflector: Reflector,
      private readonly userService: UserService,
      ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const isOpen = this.reflector.get<string[]>('isOpen', context.getClass()) || this.reflector.get<string[]>('isOpen', context.getHandler()); 
        if (isOpen) {
            return true;
        }
        // 请求头必须要带token才可以访问
        return this.validateRequest(request);
    }
    async validateRequest(req: Request): Promise<boolean> {
      const authHeaders = req.headers.token;
      if (authHeaders) {
        const token = authHeaders;
        const decoded: any = await jwt.verify(token, SECRET);
        if (!decoded || !decoded.id) {
          throw new HttpException('Token error.', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findById(decoded.id);
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
        req.user = user;
        return true
      } else {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
    }
}
