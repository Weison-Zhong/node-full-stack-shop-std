import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_VERSION_KEY } from 'src/common/contants/redis.contant';
import { SharedService } from 'src/shared/shared.service';
import { In, Repository } from 'typeorm';
import { DeptService } from '../dept/dept.service';
import { RoleService } from '../role/role.service';
import { ReqAddUserDto, ReqUpdateUserDto } from './dto/req-user.dto';
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
}
