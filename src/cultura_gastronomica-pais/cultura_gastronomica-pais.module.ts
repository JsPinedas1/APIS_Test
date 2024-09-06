import { Module } from '@nestjs/common';
import { CulturaGastronomicaPaisService } from './cultura_gastronomica-pais.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaPaisController } from './cultura_gastronomica-pais.controller';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, PaisEntity])],
  providers: [CulturaGastronomicaPaisService],
  controllers: [CulturaGastronomicaPaisController]
})
export class CulturaGastronomicaPaisModule {}
