import {CanActivate, ExecutionContext, HttpStatus, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {ApiException} from "../exceptions/api.exception";
import {ApiErrorCode} from "../enums/api.error.code";
import { Request } from "express";

@Injectable()
export class RequestIdGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequestId(request);
    }

    /**
     * 验证requestId不能为空
     * @param req
     */
    async validateRequestId(req: Request): Promise<boolean> {
        const authRequestId = req.headers.requestid;
        if (authRequestId) {
            const requestId = authRequestId;
            req.requestId = authRequestId;
            return true
        } else {
            throw new ApiException('requestId不能为空', ApiErrorCode.REQUESTID_NULL, HttpStatus.BAD_REQUEST);
        }
    }
}
