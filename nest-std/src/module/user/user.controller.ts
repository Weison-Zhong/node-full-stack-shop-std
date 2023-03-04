import { Controller, Get, Post, Body, Patch, Param, Delete, Put, forwardRef, Inject, Query } from '@nestjs/common';
import { ApiException } from 'src/common/exceptions/api.exception';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { ReqRoleListDto } from '../role/dto/req-role.dto';
import { RoleService } from '../role/role.service';
import { ReqAddUserDto, ReqUpdateUserDto, ReqUserListDto } from './dto/req-user.dto';
import { ResUserInfoDto, ResUserDto } from './dto/res-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) { }

  /* 分页查询用户列表 */
  @Get('list')
  async list(
    @Query(PaginationPipe) reqUserListDto: ReqUserListDto,
  ) {
    return this.userService.list(reqUserListDto, null, null);
  }


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

  /* 通过id查询用户信息 */
  @Get(':userId')
  async one(@Param('userId') userId: number): Promise<ResUserInfoDto> {
    const roles = await this.roleService.list(new ReqRoleListDto());
    const user = (await this.userService.userAllInfo(userId)) as ResUserDto;
    user.deptId = user.dept ? user.dept.deptId : null;
    const roleIds = user.roles.map((item) => item.roleId);
    user.roleIds = [];
    return {
      data: user,
      roleIds,
      roles: roles.rows,
    };
  }
}
