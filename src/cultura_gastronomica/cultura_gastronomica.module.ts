import { Module } from '@nestjs/common';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity/cultura_gastronomica.entity';
import { CulturaGastronomicaController } from './cultura_gastronomica.controller';

@Module({
  providers: [CulturaGastronomicaService],
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
  controllers: [CulturaGastronomicaController],
})
export class CulturaGastronomicaModule {}
