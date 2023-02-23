import { Body, Controller, Post } from '@nestjs/common';
import { DeptService } from './dept.service';
import { ReqAddDeptDto } from './dto/req-dept.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('部门管理')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) { }
  /* 新增部门 */
  @Post()
  async add(
    @Body() reqAddDeptDto: ReqAddDeptDto,
  ) {
    // reqAddDeptDto.createBy = reqAddDeptDto.updateBy = userName;
    console.log({ reqAddDeptDto });
    await this.deptService.addOrUpdate(reqAddDeptDto)
  }
}
