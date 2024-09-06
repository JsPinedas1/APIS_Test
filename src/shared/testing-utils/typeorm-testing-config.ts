import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [RecetaEntity, RestauranteEntity, PaisEntity, ProductoEntity, CulturaGastronomicaEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([RecetaEntity, RestauranteEntity, PaisEntity, ProductoEntity, CulturaGastronomicaEntity]),
];