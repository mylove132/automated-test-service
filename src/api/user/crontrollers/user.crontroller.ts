import { Get, Controller, Body, Post, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get(':id')
  async findUserById(@Param('id') userId: number){
    console.log(userId);
    return await this.userService.findUserById(userId);
  }
}
