import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReqAddDeptDto } from './dto/req-dept.dto';
import { Dept } from './entities/dept.entity';

@Injectable()
export class DeptService {
    /**
     *
     */
    constructor(@InjectRepository(Dept) private readonly deptRepository: Repository<Dept>) { }
    async addOrUpdate(reqAddDeptDto: ReqAddDeptDto) {
        // await this.deptRepository.save(reqAddDeptDto)
    }
}
