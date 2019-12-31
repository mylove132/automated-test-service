import { Post, Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiUseTags('user')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @ApiOperation({ title: 'login', description: '登录接口' })
  @ApiResponse({ status: 200, description: 'login success.'})
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.userService.login(loginUserDto);
  }
}
