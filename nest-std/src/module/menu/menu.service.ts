import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ReqAddMenuDto, ReqMenuListDto } from './dto/req-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) { }

  async addOrUpdate(reqAddMenuDto: ReqAddMenuDto) {
    if (reqAddMenuDto.parentId) {
      const parentMenu = await this.findById(reqAddMenuDto.parentId);
      reqAddMenuDto.parent = parentMenu;
    }
    await this.menuRepository.save(reqAddMenuDto)
  }

  /* 删除菜单 */
  async delete(menuId: number) {
    const menu = await this.menuRepository.findOneBy({ menuId });
    if (!menu) return;
    menu.roles = [];
    await this.menuRepository.save(menu);
    return this.menuRepository.delete(menuId);
  }

  /* 通过id查询 */
  async findById(menuId: number) {
    return this.menuRepository.findOneBy({ menuId });
  }

  /* 通过id查询，返回原始数据 */
  async findRawById(menuId: number | string) {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .select('menu.menuId', 'menuId')
      .addSelect('menu.createTime', 'createTime')
      .addSelect('menu.menuName', 'menuName')
      .addSelect('menu.orderNum', 'orderNum')
      .addSelect('menu.status', 'status')
      .addSelect('menu.perms', 'perms')
      .addSelect('menu.icon', 'icon')
      .addSelect('menu.component', 'component')
      .addSelect('menu.menuType', 'menuType')
      .addSelect('menu.isFrame', 'isFrame')
      .addSelect('menu.isCache', 'isCache')
      .addSelect('menu.visible', 'visible')
      .addSelect('menu.path', 'path')
      .addSelect('menu.query', 'query')
      .addSelect('ifnull(menu.parentMenuId,0)', 'parentId')
      .andWhere('menu.menuId = :menuId', { menuId })
      .getRawOne();
  }

  /* 通过 parentId 查询其所有孩子 */
  async findChildsByParentId(parentId: number): Promise<Menu[]> {
    return this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.parentmenuId = :parentId', { parentId })
      .getMany();
  }

  /* 查询菜单列表 */
  async list(reqMenuListDto: ReqMenuListDto) {
    const where: FindOptionsWhere<Menu> = {};
    if (reqMenuListDto.menuName) {
      where.menuName = Like(`%${reqMenuListDto.menuName}%`);
    }
    if (reqMenuListDto.status) {
      where.status = reqMenuListDto.status;
    }
    return await this.menuRepository
      .createQueryBuilder('menu')
      .select('menu.menuId', 'menuId')
      .addSelect('menu.createTime', 'createTime')
      .addSelect('menu.menuName', 'menuName')
      .addSelect('menu.orderNum', 'orderNum')
      .addSelect('menu.status', 'status')
      .addSelect('menu.perms', 'perms')
      .addSelect('menu.icon', 'icon')
      .addSelect('menu.component', 'component')
      .addSelect('menu.menuType', 'menuType')
      .addSelect('ifnull(menu.parentMenuId,0)', 'parentId')
      .where(where)
      .orderBy('menu.orderNum', 'ASC')
      .addOrderBy('menu.createTime', 'ASC')
      .getRawMany();
  }
}
