import {Injectable, NestMiddleware} from "@nestjs/common";

@Injectable()
export class OperateMiddleware implements NestMiddleware{
    use(req: any, res: any, next: () => void): any {
    }

}
