import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';
import { DeptModule } from '../dept/dept.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => MenuModule),
    forwardRef(() => DeptModule),
    forwardRef(() => UserModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule { }
