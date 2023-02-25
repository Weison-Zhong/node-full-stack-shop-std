import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';
import { Dept } from "../entities/dept.entity";
import { OmitType } from "@nestjs/swagger";

export class ReqDeptListDto {
    /* 部门名称 */
    @IsOptional() //可选字段，当有值时做下面装饰器的校验
    @IsString()
    deptName?: string;

    /* 状态 */
    @IsOptional()
    @IsString()
    status?: string;
}

export class ReqAddDeptDto extends OmitType(Dept, ['deptId'] as const) {
    /* 父部门Id */
    @Type()
    @IsNumber()
    parentId: number;
}

export class ReqUpdateDept extends Dept {
    /* 父部门Id */
    @Type()
    @IsNumber()
    parentId: number;
}
