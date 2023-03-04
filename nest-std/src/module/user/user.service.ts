import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { USER_VERSION_KEY } from 'src/common/contants/redis.contant';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { SharedService } from 'src/shared/shared.service';
import { Between, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { DeptService } from '../dept/dept.service';
import { RoleService } from '../role/role.service';
import { ReqAddUserDto, ReqUpdateUserDto, ReqUserListDto } from './dto/req-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly deptService: DeptService,
    private readonly sharedService: SharedService,
    @InjectRedis() private readonly redis: Redis,
  ) {
  }
  /* 通过用户名获取用户,排除删除的 */
  async findOneByUserNameState(username: string) {
    return await this.userRepository.findOne({
      select: ['userId', 'userName', 'password', 'salt', 'status', 'delFlag'],
      where: {
        userName: username,
        delFlag: '0',
      },
    });
  }

  /* 新增用户 */
  async addUser(reqAddUserDto: ReqAddUserDto) {
    const dept = await this.deptService.findById(reqAddUserDto.deptId);
    const roles = await this.roleService.listByIdArr(reqAddUserDto.roleIds);
    reqAddUserDto.dept = dept;
    reqAddUserDto.roles = roles;
    if (reqAddUserDto.password) {
      reqAddUserDto.salt = this.sharedService.generateUUID();
      reqAddUserDto.password = this.sharedService.md5(
        reqAddUserDto.password + reqAddUserDto.salt,
      );
    }
    await this.userRepository.save(reqAddUserDto);
  }

  /* 删除用户 */
  async delete(userIdArr: string[]) {
    return await this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        delFlag: '2',
      })
      .where({
        userId: In(userIdArr),
      })
      .execute();
  }

  /* 编辑用户 */
  async updateUser(reqUpdateUserDto: ReqUpdateUserDto) {
    const dept = await this.deptService.findById(reqUpdateUserDto.deptId);
    const roles = await this.roleService.listByIdArr(reqUpdateUserDto.roleIds);
    reqUpdateUserDto.dept = dept;
    reqUpdateUserDto.roles = roles;
    await this.userRepository.save(reqUpdateUserDto);
    if (
      await this.redis.get(`${USER_VERSION_KEY}:${reqUpdateUserDto.userId}`)
    ) {
      await this.redis.set(`${USER_VERSION_KEY}:${reqUpdateUserDto.userId}`, 2); //调整密码版本，强制用户重新登录
    }
  }
  //通过id 查找用户的所有信息
  async userAllInfo(userId: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dept', 'dept', 'dept.delFlag = 0')
      .leftJoinAndSelect('user.roles', 'role', 'role.delFlag = 0')
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  /* 通过用户名获取用户,排除停用和删除的,用于登录 */
  async findOneByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user.userId')
      .addSelect('user.userName')
      .addSelect('user.password')
      .addSelect('user.salt')
      .addSelect('user.dept')
      .leftJoinAndSelect('user.dept', 'dept')
      .where({
        userName: username,
        delFlag: '0',
        status: '0',
      })
      .getOne();
    return user;
  }

  /* 分页查询用户列表 */
  async list(
    reqUserListDto: ReqUserListDto,
    roleId?: number,
    reverse?: boolean,
  ): Promise<PaginatedDto<User>> {
    const where: FindOptionsWhere<User> = { delFlag: '0' };
    if (reqUserListDto.userName) {
      where.userName = Like(`%${reqUserListDto.userName}%`);
    }
    if (reqUserListDto.phonenumber) {
      where.phonenumber = Like(`%${reqUserListDto.phonenumber}%`);
    }
    if (reqUserListDto.status) {
      where.status = reqUserListDto.status;
    }
    if (reqUserListDto.params) {
      where.createTime = Between(
        reqUserListDto.params.beginTime,
        moment(reqUserListDto.params.endTime).add(1, 'day').format(),
      );
    }
    // const deptId = reqUserListDto.deptId ?? '';
    const queryBuilde = this.userRepository
      .createQueryBuilder('user')
      .innerJoin(User, 'user2', 'user.createBy = user2.userName');
    // if (deptId) {
    //   queryBuilde.innerJoinAndSelect(
    //     'user.dept',
    //     'dept',
    //     "concat('.',dept.mpath) like :v",
    //     { v: '%.' + deptId + '.%' },
    //   );
    // } else {
    //   queryBuilde.leftJoinAndSelect('user.dept', 'dept');
    // }
    if (roleId && !reverse) {
      queryBuilde
        .innerJoin('user.roles', 'role', 'role.roleId = :roleId', { roleId })
        .andWhere('role.delFlag = 0');
    }
    if (roleId && reverse) {
      queryBuilde.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.userId')
          .from(User, 'user')
          .leftJoin('user.roles', 'role')
          .where('role.roleId = :roleId', { roleId })
          .getQuery();
        return 'user.userId not in ' + subQuery;
      });
    }
    const result = await queryBuilde
      .andWhere(where)
      .orderBy('user.createTime', 'ASC')
      .skip(reqUserListDto.skip)
      .take(reqUserListDto.take)
      .getManyAndCount();
    return {
      rows: result[0],
      total: result[1],
    };
  }

}
