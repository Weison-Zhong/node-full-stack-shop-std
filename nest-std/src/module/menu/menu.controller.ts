import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
import { ReqAddMenuDto, ReqMenuListDto } from './dto/req-menu.dto';
import { MenuService } from './menu.service';
import { ApiException } from 'src/common/exceptions/api.exception';
@ApiTags('菜单管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  @Post()
  async add(@Body() reqAddMenuDto: ReqAddMenuDto) {
    await this.menuService.addOrUpdate(reqAddMenuDto);
  }


  /* 删除菜单 */
  @Delete(':menuId')
  async delete(@Param('menuId') menuId: number) {
    const childs = await this.menuService.findChildsByParentId(menuId);
    if (childs && childs.length)
      throw new ApiException('该菜单下还存在其他菜单，无法删除');
    await this.menuService.delete(menuId);
  }

  /* 菜单列表 */
  @Get('list')
  async list(@Query() reqMenuListDto: ReqMenuListDto) {
    const menutArr = await this.menuService.list(reqMenuListDto);
    return DataObj.create(menutArr);
  }
  /* 通过id查询列表 */
  @Get(':menuId')
  async one(@Param('menuId') menuId: number) {
    const menu = await this.menuService.findRawById(menuId);
    return DataObj.create(menu);
  }
}
