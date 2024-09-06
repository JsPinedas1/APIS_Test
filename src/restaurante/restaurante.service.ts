/* eslint-disable prettier/prettier */

import { BusinessError, BusinessLogicException } from "src/shared/errors/business-errors";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RestauranteEntity } from "./restaurante.entity/restaurante.entity";

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>
  ){ }

  async findAll(): Promise<RestauranteEntity[]> {
    return await this.restauranteRepository.find({ relations: ["culturasGastronomicas", "paises"] });
  }

  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({ where: { id_restaurante: id }, relations: ["culturasGastronomicas", "paises"] });
    if (!restaurante) {
      throw new BusinessLogicException(`Restaurante con id ${id} no encontrado`, BusinessError.NOT_FOUND);
    }
    return restaurante;
  }

  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.restauranteRepository.save(restaurante);
  }

  async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    const existingRestaurante = await this.restauranteRepository.findOne({ where: { id_restaurante: id }});
    if (!existingRestaurante) {
      throw new BusinessLogicException(`Restaurante con id ${id} no encontrado`, BusinessError.NOT_FOUND);
    }
    return await this.restauranteRepository.save({ ...existingRestaurante, ...restaurante });
  }

  async delete(id: string): Promise<void> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{id_restaurante: id}});
      if (!restaurante)
        throw new BusinessLogicException(`Restaurante con id ${id} no encontrado`, BusinessError.NOT_FOUND);
    
      await this.restauranteRepository.remove(restaurante);
  }

}
