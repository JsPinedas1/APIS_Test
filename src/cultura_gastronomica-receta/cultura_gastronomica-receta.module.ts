import { Module } from '@nestjs/common';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaRecetaController } from './cultura_gastronomica-receta.controller';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
  providers: [CulturaGastronomicaRecetaService],
  controllers: [CulturaGastronomicaRecetaController],
})
export class CulturaGastronomicaRecetaModule {}
