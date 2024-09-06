import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisController } from './pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity])],
  providers: [PaisService],
  controllers: [PaisController]
})
export class PaisModule {}
