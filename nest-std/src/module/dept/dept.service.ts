import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ReqAddDeptDto, ReqDeptListDto } from './dto/req-dept.dto';
import { Dept } from './entities/dept.entity';

@Injectable()
export class DeptService {
    /**
     *
     */
    constructor(@InjectRepository(Dept) private readonly deptRepository: Repository<Dept>) { }
    async addOrUpdate(reqAddDeptDto: ReqAddDeptDto) {
        await this.deptRepository.save(reqAddDeptDto)
    }

    async delete(deptId: string) {
        return this.deptRepository.createQueryBuilder().update().set({ delFlag: "2" })
            .where({ deptId })
            .execute()
    }

    async findRawById(deptId: number | string) {
        return await this.deptRepository.createQueryBuilder("dept")
            .select("dept.deptId", "deptId")
            .addSelect('dept.createTime', 'createTime')
            .addSelect('dept.deptName', 'deptName')
            .addSelect('dept.orderNum', 'orderNum')
            .addSelect('dept.status', 'status')
            .addSelect('dept.leader', 'leader')
            .addSelect('dept.phone', 'phone')
            .addSelect('dept.email', 'email')
            .addSelect('ifnull(dept.parentDeptId,0)', 'parentId')
            .where('dept.delFlag = 0')
            .andWhere('dept.deptId = :deptId', { deptId })
            .getRawOne();
    }

    /* 查询部门列表 */
    async list(reqDeptListDto: ReqDeptListDto) {
        console.log({reqDeptListDto});
        const where: FindOptionsWhere<Dept> = { delFlag: '0' };
        if (reqDeptListDto.deptName) {
            where.deptName = Like(`%${reqDeptListDto.deptName}%`);
        }
        if (reqDeptListDto.status) {
            where.status = reqDeptListDto.status;
        }
        return this.deptRepository
            .createQueryBuilder('dept')
            .select('dept.deptId', 'deptId')
            .addSelect('dept.createTime', 'createTime')
            .addSelect('dept.deptName', 'deptName')
            .addSelect('dept.orderNum', 'orderNum')
            .addSelect('dept.status', 'status')
            .addSelect('ifnull(dept.parentDeptId,0)', 'parentId')
            .where(where)
            .orderBy('dept.orderNum', 'ASC')
            .addOrderBy('dept.createTime', 'ASC')
            .getRawMany();
    }
}
