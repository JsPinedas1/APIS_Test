/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PaisEntity } from "src/pais/pais.entity/pais.entity";
import { RestauranteEntity } from "src/restaurante/restaurante.entity/restaurante.entity";

import { PaisRestauranteService } from "./pais-restaurante.service";

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, RestauranteEntity])],
  providers: [PaisRestauranteService]
})
export class PaisRestauranteModule {}
