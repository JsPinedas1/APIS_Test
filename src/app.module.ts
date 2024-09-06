import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { CulturaGastronomicaModule } from './cultura_gastronomica/cultura_gastronomica.module';
import { PaisEntity } from './pais/pais.entity/pais.entity';
import { PaisModule } from './pais/pais.module';
import { ProductoEntity } from './producto/producto.entity/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { RecetaEntity } from './receta/receta.entity/receta.entity';
import { RecetaModule } from './receta/receta.module';
import { RestauranteEntity } from './restaurante/restaurante.entity/restaurante.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CulturaGastronomicaPaisModule } from './cultura_gastronomica-pais/cultura_gastronomica-pais.module';
import { CulturaGastronomicaProductoModule } from './cultura_gastronomica-producto/cultura_gastronomica-producto.module';
import { CulturaGastronomicaRestauranteModule } from './cultura_gastronomica-restaurante/cultura_gastronomica-restaurante.module';
import { CulturaGastronomicaRecetaModule } from './cultura_gastronomica-receta/cultura_gastronomica-receta.module';
import { PaisRestauranteModule } from './pais-restaurante/pais-restaurante.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
 imports: [RecetaModule, RestauranteModule, PaisModule, ProductoModule, CulturaGastronomicaModule,
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'Cumplimos2020*',
     database: 'culturagastronomica',
     entities: [RecetaEntity, RestauranteEntity, PaisEntity, ProductoEntity, CulturaGastronomicaEntity],
     dropSchema: true,
     synchronize: true,
     keepConnectionAlive: true
   }),
   CulturaGastronomicaPaisModule,
   CulturaGastronomicaProductoModule,
   CulturaGastronomicaRestauranteModule,
   CulturaGastronomicaRecetaModule,
   PaisRestauranteModule,
   UserModule,
   AuthModule
 ],
 controllers: [AppController],
 providers: [AppService]
})
export class AppModule {}