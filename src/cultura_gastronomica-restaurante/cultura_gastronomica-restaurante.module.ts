import { Module } from '@nestjs/common';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { CulturaGastronomicaRestauranteController } from './cultura_gastronomica-restaurante.controller';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity])],
  providers: [CulturaGastronomicaRestauranteService],
  controllers: [CulturaGastronomicaRestauranteController]
})
export class CulturaGastronomicaRestauranteModule {}
