/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RestauranteEntity } from "./restaurante.entity/restaurante.entity";
import { RestauranteService } from "./restaurante.service";
import { RestauranteController } from './restaurante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity])],
  providers: [RestauranteService],
  controllers: [RestauranteController]
})

export class RestauranteModule {}
