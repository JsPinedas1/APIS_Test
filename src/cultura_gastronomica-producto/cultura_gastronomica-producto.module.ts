import { Module } from '@nestjs/common';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { CulturaGastronomicaProductoController } from './cultura_gastronomica-producto.controller';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity])],
  providers: [CulturaGastronomicaProductoService],
  controllers: [CulturaGastronomicaProductoController]
})
export class CulturaGastronomicaProductoModule {}
