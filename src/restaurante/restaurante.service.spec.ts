/* eslint-disable prettier/prettier */

import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "src/shared/testing-utils/typeorm-testing-config";

import { CulturaGastronomicaEntity } from "src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity";
import { PaisEntity } from "src/pais/pais.entity/pais.entity";
import { RestauranteEntity } from "./restaurante.entity/restaurante.entity";

import { RestauranteService } from "./restaurante.service";


describe("RestauranteService", () => {

  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];
  let service: RestauranteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        estrellas_michelin: faker.string.numeric(1),
        fecha: faker.date.past().toISOString(),
        culturasGastronomicas: [ Object.assign(new CulturaGastronomicaEntity(), {}) ],
        paises: [ Object.assign(new PaisEntity(), {}) ]
      });
      restaurantesList.push(restaurante);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("create should return a new restaurante", async () => {
    const restaurante: RestauranteEntity = {
      id_restaurante: faker.string.uuid(),
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString(),
      culturasGastronomicas: [ Object.assign(new CulturaGastronomicaEntity(), {}) ],
      paises: [ Object.assign(new PaisEntity(), {}) ]
    };

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({ where: { id_restaurante: newRestaurante.id_restaurante } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante.ciudad).toEqual(newRestaurante.ciudad);
    expect(storedRestaurante.estrellas_michelin).toEqual(newRestaurante.estrellas_michelin);
    expect(storedRestaurante.fecha).toEqual(newRestaurante.fecha);
  });

  it("findAll should return all restaurantes", async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it("findOne should return a restaurante by id", async () => {
    const storedRestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(storedRestaurante.id_restaurante);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre);
    expect(restaurante.ciudad).toEqual(storedRestaurante.ciudad);
    expect(restaurante.estrellas_michelin).toEqual(storedRestaurante.estrellas_michelin);
    expect(restaurante.fecha).toEqual(storedRestaurante.fecha);
  });

  it("findOne should throw an exception for an invalid restaurante", async () => {
  await expect(service.findOne("0")).rejects.toHaveProperty("message", "Restaurante con id 0 no encontrado");
});

  it("update should modify a restaurante", async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.ciudad = "Nueva ciudad";

    const updatedRestaurante: RestauranteEntity = await service.update(restaurante.id_restaurante, restaurante);
    expect(updatedRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({ where: { id_restaurante: restaurante.id_restaurante } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.ciudad).toEqual(restaurante.ciudad);
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre", ciudad: "Nueva ciudad"
    };
    const invalidId = "invalid-id";
    await expect(service.update(invalidId, restaurante)).rejects.toHaveProperty("message", `Restaurante con id ${invalidId} no encontrado`);
  });

  it("delete should remove a restaurante", async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id_restaurante);

    const deletedRestaurante: RestauranteEntity = await repository.findOne({ where: { id_restaurante: restaurante.id_restaurante } });
    expect(deletedRestaurante).toBeNull();
  });

  it("delete should throw an exception for an invalid restaurante", async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id_restaurante);
    await expect(service.delete("0")).rejects.toHaveProperty("message", "Restaurante con id 0 no encontrado");
  });

});
