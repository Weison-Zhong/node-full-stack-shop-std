import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@Tree('materialized-path')
export class Dept extends BaseEntity {
  /*  部门id */
  @PrimaryGeneratedColumn({
    name: 'dept_id',
    comment: '部门id',
    type: 'int',
  })
  @Type()
  @IsNumber()
  @ApiProperty()
  deptId: number;

  /* 部门名称 */
  @Column({
    name: 'dept_name',
    comment: '部门名称',
    default: '',
    length: 50,
  })
  @IsString()
  @ApiProperty()
  deptName: string;

  /*显示顺序  */
  @Column({
    name: 'order_num',
    comment: '显示顺序',
    default: 0,
  })
  @IsNumber()
  @ApiProperty()
  orderNum: number;

  /* 负责人 */
  @Column({
    name: 'leader',
    comment: '负责人',
    length: 20,
    default: null,
  })
  @IsOptional()
  @IsString()
  @ApiProperty()
  leader?: string;

  /* 联系电话 */
  @Column({
    name: 'phone',
    comment: '联系电话',
    length: 11,
    default: null,
  })
  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  /* 邮箱 */
  @Column({
    name: 'email',
    comment: '邮箱',
    length: 50,
    default: null,
  })
  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string;

  /* 部门状态 */
  @Column({
    name: 'status',
    comment: '部门状态（0正常 1停用）',
    length: 1,
    default: '0',
    type: 'char',
  })
  @IsString()
  @ApiProperty()
  status: string;

  @Column({
    name: 'del_flag',
    comment: '删除标志（0代表存在 2代表删除）',
    length: 1,
    default: '0',
    type: 'char',
  })
  delFlag: string;

  @TreeChildren()
  children: Dept[];

  @TreeParent()
  parent: Dept;

  @ManyToMany(() => Role, (role) => role.depts)
  roles: Role[];

  @OneToMany(() => User, (user) => user.dept)
  users: User[];
}
