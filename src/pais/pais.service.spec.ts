import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity/pais.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];
    for(let i = 0; i < 5; i++){
        const pais: PaisEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.word.words(),
        culturasGastronomicas: [ Object.assign(new CulturaGastronomicaEntity(), {}) ],
        restaurantes: [ Object.assign(new RestauranteEntity(), {}) ]})
        paisesList.push(pais);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisesList.length);
  });
  
   it('findOne should return a country by id', async () => {
    const storedPais: PaisEntity = paisesList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id_pais);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
  });
  
  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El país con el ID 0 no fue encontrado")
  });
  
  it('create should return a new country', async () => {
    const pais: PaisEntity = {
      id_pais: faker.string.uuid(),
      nombre: faker.company.name(),
      codigo: faker.word.words(),
      culturasGastronomicas: [],
      restaurantes: []
    };
 
    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();
 
    const storedPais: PaisEntity = await repository.findOne({where: {codigo: newPais.codigo}})
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre)
  });
  
  it('update should modify a country', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = "Nuevo nombre";
     const updatedPais: PaisEntity = await service.update(pais.id_pais, pais);
    expect(updatedPais).not.toBeNull();
     const storedPais: PaisEntity = await repository.findOne({ where: { id_pais: pais.id_pais } })
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre)
  });
  
  it('update should throw an exception for an invalid country', async () => {
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais, nombre: "Nuevo nombre"
    }
    await expect(() => service.update("0", pais)).rejects.toHaveProperty("message", "El país con el ID 0 no fue encontrado")
  });
  
  it('delete should remove a country', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id_pais);
     const deletedPais: PaisEntity = await repository.findOne({ where: { id_pais: pais.id_pais } })
    expect(deletedPais).toBeNull();
  });
  
  it('delete should throw an exception for an invalid pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El país con el ID 0 no fue encontrado")
  });

});