/* eslint-disable prettier/prettier */

import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "src/shared/testing-utils/typeorm-testing-config";

import { PaisEntity } from "src/pais/pais.entity/pais.entity";
import { RestauranteEntity } from "src/restaurante/restaurante.entity/restaurante.entity";

import { PaisRestauranteService } from "./pais-restaurante.service";

describe("PaisRestauranteService", () => {
  let pais: PaisEntity;
  let paisRepository: Repository<PaisEntity>;
  let restaurante: RestauranteEntity;
  let restauranteRepository: Repository<RestauranteEntity>;
  let service: PaisRestauranteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisRestauranteService],
    }).compile();

    service = module.get<PaisRestauranteService>(PaisRestauranteService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    restauranteRepository.clear();

    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString(),
    });

    pais = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode(),
      restaurantes: [restaurante],
    });
  };

  it("addRestauranteToPais should add a restaurante to a pais", async () => {
    const newRestaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString(),
    });

    const updatedPais = await service.addRestauranteToPais(pais.id_pais, newRestaurante.id_restaurante);
    expect(updatedPais.restaurantes.length).toBe(2);
    expect(updatedPais.restaurantes.find(r => r.id_restaurante === newRestaurante.id_restaurante)).not.toBeNull();
  });

  it("findRestauranteFromPais should return a restaurante from a pais", async () => {
    const storedRestaurante = await service.findRestauranteFromPais(pais.id_pais, restaurante.id_restaurante);
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
  });

  it("findRestaurantesFromPais should return all restaurantes from a pais", async () => {
    const restaurantes = await service.findRestaurantesFromPais(pais.id_pais);
    expect(restaurantes).not.toBeNull();
    expect(restaurantes.length).toBe(1);
  });

  it("updateRestaurantesFromPais should update the list of restaurantes in a pais", async () => {
    const newRestaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString(),
    });

    const updatedPais = await service.updateRestaurantesFromPais(pais.id_pais, [newRestaurante]);
    expect(updatedPais.restaurantes.length).toBe(1);
    expect(updatedPais.restaurantes[0].id_restaurante).toBe(newRestaurante.id_restaurante);
  });

  it("deleteRestauranteFromPais should remove a restaurante from a pais", async () => {
    await service.deleteRestauranteFromPais(pais.id_pais, restaurante.id_restaurante);

    const storedPais = await paisRepository.findOne({ where: { id_pais: pais.id_pais }, relations: ["restaurantes"] });
    expect(storedPais.restaurantes.length).toBe(0);
  });
});
