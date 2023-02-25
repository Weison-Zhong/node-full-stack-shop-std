import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DeptService } from './dept.service';
import { ReqAddDeptDto, ReqDeptListDto, ReqUpdateDept } from './dto/req-dept.dto';
import { ApiTags } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
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

  @Delete(":deptId")
  async delete(@Param('deptId') deptId: string) {
    await this.deptService.delete(deptId)
  }

  @Put()
  async update(@Body() reqUpdateDept: ReqUpdateDept) {
    await this.deptService.addOrUpdate(reqUpdateDept)
  }

  // 部门列表
  // 顺序很重要，若和下面id查询单个换位置那就不会进入到这里
  @Get('list')
  async list(@Param() reqDeptListDto: ReqDeptListDto) {
    const deptArr = await this.deptService.list(reqDeptListDto);
    return DataObj.create(deptArr);
  }

  // id查单个部门
  @Get(":deptId")
  async one(@Param("deptId") deptId: number) {
    const dept = await this.deptService.findRawById(deptId);
    return DataObj.create(dept);
  }


}
