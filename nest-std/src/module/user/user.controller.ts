import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ReqAddUserDto, ReqUpdateUserDto } from './dto/req-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 新增用户
  @Post()
  async add(@Body() reqAddUserDto: ReqAddUserDto) {
    const user = await this.userService.findOneByUserNameState(reqAddUserDto.userName)
    if (user) throw new ApiException('该用户名已存在')
    await this.userService.addUser(reqAddUserDto)
  }

  /* 删除用户 */
  @Delete(':userIds')
  async delete(
    @Param('userIds') userIds: string,
  ) {
    const userIdArr = userIds.split(',');
    await this.userService.delete(userIdArr);
  }

  /* 编辑用户 */
  @Put()
  async update(
    @Body() reqUpdateUserDto: ReqUpdateUserDto,
  ) {
    const user = await this.userService.findOneByUserNameState(
      reqUpdateUserDto.userName,
    );
    if (user) {
      await this.userService.updateUser(reqUpdateUserDto);
    } else {
      throw new ApiException('该用户不存在');
    }
  }
}
