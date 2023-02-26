import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { ReqAddRoleDto, ReqRoleListDto, ReqUpdateRoleDto } from './dto/req-role.dto';
import { RoleService } from './role.service';

@ApiTags('角色管理')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }
  @Post()
  async add(
    @Body() reqAddRoleDto: ReqAddRoleDto
  ) {
    await this.roleService.addOrUpdate(reqAddRoleDto)
  }

  /* 删除角色 */
  @Delete(':roleIds')
  async delete(
    @Param('roleIds') roleIds: string,
  ) {
    await this.roleService.delete(roleIds.split(','));
  }

  /* 编辑角色 */
  @Put()
  async update(
    @Body() reqUpdateRoleDto: ReqUpdateRoleDto,
  ) {
    await this.roleService.addOrUpdate(reqUpdateRoleDto);
  }


  /* 分页查询角色列表 */
  @Get('list')
  async list(@Query(PaginationPipe) reqRoleListDto: ReqRoleListDto) {
    return this.roleService.list(reqRoleListDto);
  }

  /* 通过Id 查询角色 */
  @Get(':roleId')
  async one(@Param('roleId') roleId: number) {
    const role = await this.roleService.findById(roleId);
    return DataObj.create(role);
  }
}
