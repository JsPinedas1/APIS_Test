/* eslint-disable prettier/prettier */

import { BusinessError, BusinessLogicException } from "src/shared/errors/business-errors";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaisEntity } from "src/pais/pais.entity/pais.entity";
import { RestauranteEntity } from "src/restaurante/restaurante.entity/restaurante.entity";

@Injectable()
export class PaisRestauranteService {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) { }

  async addRestauranteToPais(paisId: string, restauranteId: string): Promise<PaisEntity> {
    const pais = await this.paisRepository.findOne({ where: { id_pais: paisId }, relations: ["restaurantes"] });
    if (!pais) {
      throw new BusinessLogicException(`El país con el ID ${paisId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    const restaurante = await this.restauranteRepository.findOne({ where: { id_restaurante: restauranteId } });
    if (!restaurante) {
      throw new BusinessLogicException(`El restaurante con el ID ${restauranteId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    pais.restaurantes.push(restaurante);
    return await this.paisRepository.save(pais);
  }

  async findRestauranteFromPais(paisId: string, restauranteId: string): Promise<RestauranteEntity> {
    const pais = await this.paisRepository.findOne({ where: { id_pais: paisId }, relations: ["restaurantes"] });
    if (!pais) {
      throw new BusinessLogicException(`El país con el ID ${paisId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    const restaurante = pais.restaurantes.find(r => r.id_restaurante === restauranteId);
    if (!restaurante) {
      throw new BusinessLogicException(`El restaurante con el ID ${restauranteId} no fue encontrado en el país con ID ${paisId}`, BusinessError.NOT_FOUND);
    }

    return restaurante;
  }

  async findRestaurantesFromPais(paisId: string): Promise<RestauranteEntity[]> {
    const pais = await this.paisRepository.findOne({ where: { id_pais: paisId }, relations: ["restaurantes"] });
    if (!pais) {
      throw new BusinessLogicException(`El país con el ID ${paisId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    return pais.restaurantes;
  }

  async updateRestaurantesFromPais(paisId: string, restaurantes: RestauranteEntity[]): Promise<PaisEntity> {
    const pais = await this.paisRepository.findOne({ where: { id_pais: paisId }, relations: ["restaurantes"] });
    if (!pais) {
      throw new BusinessLogicException(`El país con el ID ${paisId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    for (const restaurante of restaurantes) {
      const existingRestaurante = await this.restauranteRepository.findOne({ where: { id_restaurante: restaurante.id_restaurante } });
      if (!existingRestaurante) {
        throw new BusinessLogicException(`El restaurante con el ID ${restaurante.id_restaurante} no fue encontrado`, BusinessError.NOT_FOUND);
      }
    }

    pais.restaurantes = restaurantes;
    return await this.paisRepository.save(pais);
  }

  async deleteRestauranteFromPais(paisId: string, restauranteId: string): Promise<void> {
    const pais = await this.paisRepository.findOne({ where: { id_pais: paisId }, relations: ["restaurantes"] });
    if (!pais) {
      throw new BusinessLogicException(`El país con el ID ${paisId} no fue encontrado`, BusinessError.NOT_FOUND);
    }

    const restauranteIndex = pais.restaurantes.findIndex(r => r.id_restaurante === restauranteId);
    if (restauranteIndex === -1) {
      throw new BusinessLogicException(`El restaurante con el ID ${restauranteId} no fue encontrado en el país con ID ${paisId}`, BusinessError.NOT_FOUND);
    }

    pais.restaurantes.splice(restauranteIndex, 1);
    await this.paisRepository.save(pais);
  }
}
