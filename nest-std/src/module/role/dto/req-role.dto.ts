import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParamsDto } from 'src/common/dto/params.dto';
import { Role } from '../entities/role.entity';

/* 新增角色 */
export class ReqAddRoleDto extends OmitType(Role, ['roleId'] as const) {
  /* 菜单id数组 */
  @IsArray()
  menuIds: number[];
}

/* 编辑角色 */
export class ReqUpdateRoleDto extends ReqAddRoleDto {
  @Type()
  @IsNumber()
  roleId: number;
}

/* 分配数据权限 */
export class ReqDataScopeDto extends Role {
  /* 部门id数组 */
  @IsArray()
  deptIds: number[];
}



/* 改变角色状态 */
export class ReqChangeStatusDto {
  /* 角色id */
  @Type()
  @IsNumber()
  roleId: number;

  /* 状态值 */
  @Type()
  @IsString()
  status: string;
}


/* 单个取消用户角色授权 */
export class ReqCancelDto {
  /* 角色ID */
  @Type()
  @IsNumber()
  roleId: number;

  /* 用户ID */
  @Type()
  @IsNumber()
  userId: number;
}

/* 批量 取消/授权 用户角色授权 */
export class ReqCancelAllDto {
  /* 角色Id */
  @Type()
  @IsNumber()
  roleId: number;

  /* 用户角色字符串拼接如 1,2,3 */
  @Type()
  @IsString()
  userIds: string;
}


/* 分页查询 */
export class ReqRoleListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  roleKey?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  params: ParamsDto;
}