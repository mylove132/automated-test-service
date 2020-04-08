import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import * as jwt from "jsonwebtoken";
import { SECRET } from "../../config";
import { UserService } from "../../api/user/user.service";

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

  /**
   * 验证token不能为空
   * @param req
   */
  async validateRequest(req: Request): Promise<boolean> {
      const authHeaders = req.headers.token;
      if (authHeaders) {
        const token = authHeaders;
        let decoded;
        try {
          decoded = await jwt.verify(token, SECRET);
        } catch (error) {
          if (error && error.name == 'TokenExpiredError') {
            throw new HttpException('Token expired.', HttpStatus.UNAUTHORIZED);
          }
          throw new HttpException('Token error.', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findById(decoded.id);
        // token中的用户未找到
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
